import os
import sqlite3
from sentence_transformers import SentenceTransformer
import numpy as np

# Ruta a los documentos
DOCS_FOLDER = "./docs"
DB_PATH = "vectorstore.db"

# Carga modelo de embeddings
model = SentenceTransformer('all-MiniLM-L6-v2')

# Prepara SQLite
conn = sqlite3.connect(DB_PATH)
c = conn.cursor()
c.execute("DROP TABLE IF EXISTS documents")
c.execute("CREATE TABLE documents (id INTEGER PRIMARY KEY AUTOINCREMENT, filename TEXT, content TEXT, embedding BLOB)")

# Procesa los documentos
for filename in os.listdir(DOCS_FOLDER):
    filepath = os.path.join(DOCS_FOLDER, filename)
    if filename.endswith(".txt"):
        with open(filepath, "r", encoding="utf-8") as f:
            text = f.read()
            embedding = model.encode(text)
            c.execute("INSERT INTO documents (filename, content, embedding) VALUES (?, ?, ?)",
                      (filename, text, embedding.tobytes()))

conn.commit()
conn.close()
print("✅ Embeddings generados y guardados en vectorstore.db")

