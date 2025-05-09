# from pydantic import BaseModel
# from typing import List, Optional

# # Modèle pour la catégorie
# class Category(BaseModel):
#     id: str
#     name: str
#     image: str  # URL de l'image

# # Modèle pour la sous-catégorie
# class SubCategory(BaseModel):
#     id: str
#     name: str
#     category_id: str  # Référence à la catégorie principale
#     sizes: Optional[List[str]] = []  # Liste des tailles associées
#     image: str  # URL de l'image

# # Modèle pour la taille
# class Size(BaseModel):
#     id: str
#     name: str

# # Modèle pour les Produits
# class Product(BaseModel):
#     id: str  # ID du produit
#     name: str  # Nom du produit
#     description: str  # Description du produit
#     price: float  # Prix du produit
#     category: str  # ID de la catégorie
#     subCategory: str  # ID de la sous-catégorie
#     size: Optional[str] = None  # ID de la taille
#     brand: str  # Marque du produit
#     seller: str  # Un seul ID de vendeur (un ObjectId sous forme de string)
#     created_at: str  # Date de création du produit

# # Modèle pour les Favoris
# class Favorite(BaseModel):
#     user_id: str
#     product_id: str
#     created_at: str

# # Modèle pour les Commandes
# class Order(BaseModel):
#     user_id: str
#     items: List[dict]  # Liste des produits achetés
#     created_at: str

# # Modèle pour les Utilisateurs
# class User(BaseModel):
#     id: str
#     name: str
#     email: str
#     role: str
#     created_at: str
# === models.py ===
from pydantic import BaseModel
from typing import List, Optional

class Category(BaseModel):
    id: str
    name: str
    image: str

class SubCategory(BaseModel):
    id: str
    name: str
    category_id: str
    sizes: Optional[List[str]] = []
    image: str

class Size(BaseModel):
    id: str
    name: str

class Product(BaseModel):
    id: str
    name: str
    description: str
    price: float
    category: str
    subCategory: str
    size: Optional[str] = None
    brand: str
    material: str
    color: str
    condition: str
    images: List[str]
    seller: str
    etat: str
    created_at: str

class Favorite(BaseModel):
    user_id: str
    product_id: str
    created_at: str

class OrderItem(BaseModel):
    product: str  # ID du produit
    price: float  # Prix du produit
    seller: str  # ID du vendeur

class Order(BaseModel):
    user_id: str  # ID de l'utilisateur
    items: List[OrderItem]  # Liste d'objets avec product, price, seller
    total: float  # Total de la commande
    shipping_address: str  # Adresse de livraison
    status: Optional[str] = 'En traitement'  # Statut de la commande (optionnel)
    created_at: str  # Date de création de la commande

class User(BaseModel):
    id: str
    name: str
    email: str
    role: str
    isActivated: bool
    avatar_url: Optional[str] = ""
    created_at: str
