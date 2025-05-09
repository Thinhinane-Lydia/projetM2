# from fastapi import FastAPI
# from recombee import recommend_products,add_user_to_recombee,add_user_view,send_recommendations_to_node
# from sync_recombee import sync_products_to_recombee, sync_favorites_to_recombee, sync_orders_to_recombee, sync_users_to_recombee, sync_all_categories_to_recombee, sync_subcategories_to_recombee, sync_sizes_to_recombee
# from database import connect_database
# from fastapi.staticfiles import StaticFiles
# import os

# app = FastAPI()
# db = connect_database()
# # Définir le chemin vers le dossier 'uploads' à la racine du projet
# uploads_dir = os.path.join(os.path.dirname(__file__), "../../uploads")

# # Vérifier que le répertoire 'uploads' existe
# if not os.path.exists(uploads_dir):
#     raise RuntimeError(f"Le répertoire 'uploads' n'existe pas à {uploads_dir}")

# # Servir les fichiers du dossier 'uploads' pour qu'ils soient accessibles via /uploads
# app.mount("/uploads", StaticFiles(directory=uploads_dir), name="uploads")

# # Synchronisation des données avec Recombee au démarrage
# @app.on_event("startup")
# async def startup_event():
#     print("Démarrage de l'application et synchronisation des données...")
#     sync_products_to_recombee()  # Synchroniser les produits
#     sync_users_to_recombee()  # Synchroniser les utilisateurs
#     sync_favorites_to_recombee()  # Synchroniser les favoris
#     sync_orders_to_recombee()  # Synchroniser les commandes
#     sync_all_categories_to_recombee()  # Synchroniser toutes les catégories
#     sync_subcategories_to_recombee()  # Synchroniser les sous-catégories
#     sync_sizes_to_recombee()  # Synchroniser les tailles

#  # Ajouter chaque utilisateur à Recombee et récupérer les recommandations
#     users = db["users"].find()  # Récupérer tous les utilisateurs
#     for user in users:
#     user_id = str(user["_id"])
#     # Ajouter l'utilisateur à Recombee
#     add_user_to_recombee(user_id)

#     # Récupérer les recommandations pour cet utilisateur
#     recommendations = recommend_products(user_id)
#     print(f"Recommandations pour l'utilisateur {user_id}: {recommendations}")

#     # Envoyer ces recommandations à Node.js
#     send_recommendations_to_node(user_id, recommendations)


#     print("Synchronisation des données terminée.")
    

# @app.get("/")
# def read_root():
#     return {"message": "Bienvenue sur l'API!"}

# @app.get("/recommend/{user_id}")
# def get_recommendations(user_id: str):
#     recommendations = recommend_products(user_id)  # La fonction de recommandation de Recombee
#     return {"recommendations": recommendations}

# @app.get("/view/{user_id}/{product_id}")
# def view_product(user_id: str, product_id: str):
#     # Enregistrer la vue du produit
#     add_user_view(user_id, product_id)  # Appel de la fonction add_user_view pour enregistrer la vue
#     return {"message": f"Vue ajoutée pour l'utilisateur {user_id} et produit {product_id}"}

from fastapi import FastAPI
from recombee import recommend_products, add_user_to_recombee, add_user_view, send_recommendations_to_node
from sync_recombee import (
    sync_products_to_recombee,
    sync_favorites_to_recombee,
    sync_orders_to_recombee,
    sync_users_to_recombee,
    sync_all_categories_to_recombee,
    sync_subcategories_to_recombee,
    sync_sizes_to_recombee
)
from database import connect_database
from fastapi.staticfiles import StaticFiles
import os

app = FastAPI()
db = connect_database()

# Définir le chemin vers le dossier 'uploads' à la racine du projet
uploads_dir = os.path.join(os.path.dirname(__file__), "../../uploads")

# Vérifier que le répertoire 'uploads' existe
if not os.path.exists(uploads_dir):
    raise RuntimeError(f"Le répertoire 'uploads' n'existe pas à {uploads_dir}")

# Servir les fichiers du dossier 'uploads'
app.mount("/uploads", StaticFiles(directory=uploads_dir), name="uploads")

# Synchronisation des données avec Recombee au démarrage
@app.on_event("startup")
async def startup_event():
    print("Démarrage de l'application et synchronisation des données...")
    sync_products_to_recombee()
    sync_users_to_recombee()
    sync_favorites_to_recombee()
    sync_orders_to_recombee()
    sync_all_categories_to_recombee()
    sync_subcategories_to_recombee()
    sync_sizes_to_recombee()

    # Ajouter chaque utilisateur à Recombee et récupérer les recommandations
    users = db["users"].find()
    for user in users:
        user_id = str(user["_id"])
        add_user_to_recombee(user_id)
        recommendations = recommend_products(user_id)
        print(f"Recommandations pour l'utilisateur {user_id}: {recommendations}")
        send_recommendations_to_node(user_id, recommendations)

    print("Synchronisation des données terminée.")

@app.get("/")
def read_root():
    return {"message": "Bienvenue sur l'API!"}

@app.get("/recommend/{user_id}")
def get_recommendations(user_id: str):
    recommendations = recommend_products(user_id)
    return {"recommendations": recommendations}

@app.get("/view/{user_id}/{product_id}")
def view_product(user_id: str, product_id: str):
    add_user_view(user_id, product_id)
    return {"message": f"Vue ajoutée pour l'utilisateur {user_id} et produit {product_id}"}
