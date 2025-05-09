from recombee_api_client.api_client import RecombeeClient
from recombee_api_client.api_requests import AddRating, AddUser, RecommendItemsToUser, AddDetailView, AddItem,RecommendItemsToUser
from database import connect_database
from bson import ObjectId
import requests

client = RecombeeClient('rewear-ecommerce-recommendations', 'dWXRjdEPZMGhFdDyeX65RVTI7B2fc2vDARCkCy0vPwpsHFuJN42h5FiKiPdZWJAd')
db = connect_database()
# Ajouter une évaluation d'utilisateur pour un produit
def add_user_rating(user_id, product_id, rating):
    try:
        request = AddRating(user_id, product_id, rating)
        client.send(request)
        print(f"Évaluation ajoutée : {rating} étoiles pour le produit {product_id} par l'utilisateur {user_id}")
    except Exception as e:
        print(f"Erreur d'ajout d'évaluation : {e}")

# Recommander des produits à un utilisateur

def recommend_products(user_id: str):
    try:
        # Convertir l'ID de l'utilisateur en ObjectId
        user_id = str(user_id)  # Assurez-vous que user_id est une chaîne
       
        # Demander les recommandations à Recombee
        request = RecommendItemsToUser(user_id, count=100)
        response = client.send(request)
        print(f"Recommandations pour l'utilisateur {user_id}: {response}")

        # Extraire correctement les IDs des produits recommandés
        recommended_items = []
        if 'recomms' in response:
            # Récupérer les IDs des produits recommandés
            for item in response['recomms']:
                recommended_items.append(item['id'])
        
        print(f"IDs des produits recommandés: {recommended_items}")
        return recommended_items
    except Exception as e:
        print(f"Erreur lors de la récupération des recommandations: {e}")
        return [] 
# Ajouter une vue détaillée pour un produit
def add_user_view(user_id, product_id):
    try:
        request = AddDetailView(user_id, product_id)
        client.send(request)
        print(f"Vue détaillée ajoutée pour le produit {product_id} par l'utilisateur {user_id}")
    except Exception as e:
        print(f"Erreur d'ajout de vue détaillée : {e}")

# Ajouter un utilisateur dans Recombee

def add_user_to_recombee(user_id: str):
    try:
        request = AddUser(user_id)
        client.send(request)
        print(f"Utilisateur {user_id} ajouté à Recombee")
    except Exception as e:
        print(f"Erreur lors de l'ajout de l'utilisateur {user_id} : {e}")

def send_recommendations_to_node(user_id, recommendations):
    url = "http://localhost:8000/api/v2/recommendations/recommendations"
    
    # Construire les données à envoyer
    data = {
        "user_id": user_id,
        "recommended_products": recommendations
    }

    print(f"Envoi des données à Node.js: {data}")
    
    headers = {
        "Content-Type": "application/json"
    }

    # Envoyer les données vers ton API Node.js
    try:
        response = requests.post(url, json=data, headers=headers)
        print(f"Code de réponse: {response.status_code}")
        print(f"Contenu de la réponse: {response.text}")
        
        if response.status_code == 200:
            print(f"Recommandations envoyées avec succès pour l'utilisateur {user_id}")
        else:
            print(f"Erreur lors de l'envoi des recommandations: {response.status_code}")
    except Exception as e:
        print(f"Exception lors de l'envoi des recommandations: {e}")