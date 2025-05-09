from pymongo import MongoClient

def connect_database():
    try:
        # Informations de connexion à MongoDB
        username = "thinhinanelydia"
        password = "Projetm2"
        dbname = "test"

        # Connexion à MongoDB Atlas
        connection_string = f"mongodb+srv://{username}:{password}@cluster0.uu9e8.mongodb.net/{dbname}?retryWrites=true&w=majority"
        client = MongoClient(connection_string)

        # Accéder à la base de données
        db = client[dbname]
        print("Connecté à MongoDB Atlas")
        return db

    except Exception as e:
        print(f"Erreur de connexion à MongoDB : {e}")
