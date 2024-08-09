from firebase_admin import firestore

class Db:
    def __init__(self):
        self.db = firestore.client()  # Conexão com Firestore
    @staticmethod
    def get_client():
        return firestore.client()

    @staticmethod
    def create_document(collection_name, document_data, document_id=None):
        db = Db.get_client()
        collection_ref = db.collection(collection_name)
        if document_id:
            # Cria o documento com um ID especificado
            doc_ref = collection_ref.document(document_id)
            doc_ref.set(document_data)
        else:
            # Adiciona um novo documento e obtém a referência
            doc_ref = collection_ref.add(document_data)[1]

        # Atualiza o documento com o ID gerado, incluindo o 'id' dentro dos dados
        document_data['id'] = doc_ref.id
        doc_ref.set(document_data, merge=True)  # Atualiza o documento com o novo campo 'id'

        # Retorna o ID do documento criado
        return doc_ref.id

    @staticmethod
    def get_document(collection_name, document_id):
        db = Db.get_client()
        doc_ref = db.collection(collection_name).document(document_id)
        doc = doc_ref.get()
        if doc.exists:
            return doc.to_dict()
        else:
            return {}

    @staticmethod
    def update_document(collection_name, document_id, updates):
        db = Db.get_client()
        doc_ref = db.collection(collection_name).document(document_id)
        doc_ref.update(updates)

    @staticmethod
    def delete_document(collection_name, document_id):
        db = Db.get_client()
        doc_ref = db.collection(collection_name).document(document_id)
        doc_ref.delete()

    @staticmethod
    def delete_all_courses():
        try:
            db = firestore.client()
            courses_ref = db.collection('courses')
            docs = courses_ref.stream()

            for doc in docs:
                doc.reference.delete()

            print("All courses deleted successfully.")
        except Exception as e:
            print(f"Error deleting all courses: {e}")

    @staticmethod
    def get_all_documents(collection_name):
        db = Db.get_client()
        collection_ref = db.collection(collection_name)
        docs = collection_ref.stream()
        # Retorna o UID e os dados do documento como um dicionário
        return [{'id': doc.id, **doc.to_dict()} for doc in docs]
