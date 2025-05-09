from recombee_api_client.api_requests import AddItem,SetItemValues,AddPurchase,AddDetailView
from models import Product, Category, SubCategory, Size, User, Favorite, Order
from database import connect_database
import time
# Importer le client depuis le fichier recombee.py
from recombee import client  # Assurez-vous que 'client' est correctement défini dans recombee.py
from models import Order, OrderItem
from bson import ObjectId
import datetime
# Connexion à la base de données MongoDB
db = connect_database()



def sync_product_to_recombee(product_data):
    try:
        # Convertir l'ID en string si ce n'est pas déjà le cas
        product_id = str(product_data.id)
        
        # Créer une requête pour ajouter l'item (produit) à Recombee
        request = AddItem(product_id) 
        
        # Créer un dictionnaire avec les propriétés du produit
        properties = {
            "name": product_data.name,
            "description": product_data.description,
            "price": product_data.price,
            "category": product_data.category,
            "subCategory": product_data.subCategory,
            "size": product_data.size,  # Ajouter la taille si disponible
            "brand": product_data.brand,
            "material": product_data.material,
            "color": product_data.color,
            "condition": product_data.condition,
            "images": product_data.images,  # Liste des images
            "seller": product_data.seller,
            "etat": product_data.etat,
            "created_at": product_data.created_at,
        }

        # Envoi de la requête pour ajouter l'item à Recombee
        client.send(request)
        
        # Créer une requête pour définir les propriétés de l'item (produit) après l'ajout
        values_request = SetItemValues(product_id, properties)
        
        # Envoi de la requête pour définir les valeurs de l'item
        client.send(values_request)
        
        print(f"Produit {product_data.name} synchronisé avec Recombee")
        
    except Exception as e:
        print(f"Erreur de synchronisation du produit {product_data.id}: {e}")

def sync_products_to_recombee():
    products = db["products"].find()
    for product in products:
        images = product.get("images", [])
        # Transformez le champ images en une liste de strings (URLs)
        image_urls = [image['url'] for image in images if 'url' in image]
        
        product_data = Product(
            id=str(product["_id"]),
            name=product["name"],
            description=product["description"],
            price=product["price"],
            category=str(product["category"]),
            subCategory=str(product["subCategory"]),
            size=str(product.get("size", "")),
            brand=product["brand"],
            material=product["material"],
            color=product["color"],
            condition=product["condition"],
            images=image_urls,  # Assurez-vous que c'est une liste d'URLs
            seller=str(product["seller"]),
            etat=product.get("etat", "disponible"),
            created_at=str(product["createdAt"]),
        )
        # Synchronisation avec Recombee
        sync_product_to_recombee(product_data)

# --- Synchronisation des Utilisateurs ---
def sync_user_to_recombee(user_data):
    try:
        # Convertir l'ID en string si ce n'est pas déjà le cas
        user_id = str(user_data.id)

        # Créer une requête pour ajouter l'utilisateur à Recombee
        request = AddItem(user_id)  # Ajouter l'utilisateur à Recombee avec son ID

        # Envoi de la requête pour ajouter l'utilisateur à Recombee
        client.send(request)

        # Créer un dictionnaire avec les propriétés de l'utilisateur
        properties = {
            "name": user_data.name,
            "email": user_data.email,
            "role": user_data.role,
            "isActivated": user_data.isActivated,
            "avatar_url": user_data.avatar_url,
            "createdAt": user_data.created_at,
        }

        # Créer une requête pour définir les propriétés de l'utilisateur après l'ajout
        values_request = SetItemValues(user_id, properties)  # Associer l'ID de l'utilisateur avec ses propriétés

        # Envoi de la requête pour définir les valeurs de l'utilisateur
        client.send(values_request)

        print(f"Utilisateur {user_data.name} synchronisé avec Recombee")

    except Exception as e:
        print(f"Erreur de synchronisation de l'utilisateur {user_data.id}: {e}")

def sync_users_to_recombee():
    users = db["users"].find()
    for user in users:
        user_data = User(
            id=str(user["_id"]),
            name=user["name"],
            email=user["email"],
            role=user["role"],
            isActivated=user["isActivated"],
            avatar_url=user.get("avatar", {}).get("url", ""),
            created_at=str(user["createdAt"]),
        )
        # Synchronisation avec Recombee
        sync_user_to_recombee(user_data)



# Synchroniser une catégorie avec Recombee
def sync_category_to_recombee(category_data):
    try:
        # Convertir l'ID en string si ce n'est pas déjà le cas
        category_id = str(category_data.id)

        # Créer une requête pour ajouter la catégorie à Recombee
        request = AddItem(category_id)  # Ajouter la catégorie à Recombee avec son ID

        # Envoi de la requête pour ajouter la catégorie à Recombee
        client.send(request)

        # Créer un dictionnaire avec les propriétés de la catégorie
        properties = {
            "name": category_data.name,
            "image": category_data.image,
        }

        # Créer une requête pour définir les propriétés de la catégorie après l'ajout
        values_request = SetItemValues(category_id, properties)  # Associer l'ID de la catégorie avec ses propriétés

        # Envoi de la requête pour définir les valeurs de la catégorie
        client.send(values_request)

        print(f"Catégorie {category_data.name} synchronisée avec Recombee")

    except Exception as e:
        print(f"Erreur de synchronisation de la catégorie {category_data.id}: {e}")

def sync_all_categories_to_recombee():
    categories = db["categories"].find()
    for category in categories:
        category_data = Category(
            id=str(category["_id"]),
            name=category["name"],
            image=category["image"]
        )
        # Synchronisation avec Recombee
        sync_category_to_recombee(category_data)


# Synchroniser une sous-catégorie avec Recombee
def sync_subcategory_to_recombee(subcategory_data):
    try:
        # Convertir l'ID en string si ce n'est pas déjà le cas
        subcategory_id = str(subcategory_data.id)

        # Créer une requête pour ajouter la sous-catégorie à Recombee
        request = AddItem(subcategory_id)  # Ajouter la sous-catégorie à Recombee avec son ID

        # Envoi de la requête pour ajouter la sous-catégorie à Recombee
        client.send(request)

        # Créer un dictionnaire avec les propriétés de la sous-catégorie
        properties = {
            "name": subcategory_data.name,
            "category_id": subcategory_data.category_id,
            "sizes": subcategory_data.sizes,
            "image": subcategory_data.image,
        }

        # Créer une requête pour définir les propriétés de la sous-catégorie après l'ajout
        values_request = SetItemValues(subcategory_id, properties)  # Associer l'ID de la sous-catégorie avec ses propriétés

        # Envoi de la requête pour définir les valeurs de la sous-catégorie
        client.send(values_request)

        print(f"Sous-catégorie {subcategory_data.name} synchronisée avec Recombee")

    except Exception as e:
        print(f"Erreur de synchronisation de la sous-catégorie {subcategory_data.id}: {e}")


def sync_subcategories_to_recombee():
    subcategories = db["subcategories"].find()
    for subcategory in subcategories:
        subcategory_data = SubCategory(
            id=str(subcategory["_id"]),
            name=subcategory["name"],
            category_id=str(subcategory["category"]),
            sizes=[str(size) for size in subcategory.get("sizes", [])],
            image=subcategory["image"]
        )
        # Synchronisation avec Recombee
        sync_subcategory_to_recombee(subcategory_data)


# Synchroniser une taille avec Recombee
def sync_size_to_recombee(size):
    try:
        # Convertir l'ID en string si ce n'est pas déjà le cas
        size_id = str(size.id)
        
        # Créer un dictionnaire avec les propriétés de la taille
        properties = {
            "name": size.name
        }
        
        # D'abord, ajouter l'item sans propriétés
        client.send(AddItem(size_id))
        
        # Ensuite, mettre à jour les propriétés avec SetItemValues
        from recombee_api_client.api_requests import SetItemValues
        request = SetItemValues(size_id, properties)
        
        # Envoi de la requête pour ajouter les propriétés
        response = client.send(request)
        
        print(f"Taille {size.name} synchronisée avec Recombee")
        print(f"Réponse de Recombee : {response}")
    
    except Exception as e:
        print(f"Erreur de synchronisation de la taille {size.id}: {e}")

def sync_sizes_to_recombee():
    sizes = db["sizes"].find()
    for size in sizes:
        size_data = Size(
            id=str(size["_id"]),
            name=size["name"]
        )
        # Synchronisation avec Recombee
        sync_size_to_recombee(size_data)

def sync_favorites_to_recombee():
    favorites = db["favorites"].find()
    for favorite in favorites:
        try:
            # Vérifier si les champs nécessaires sont présents
            if "user" not in favorite or "product" not in favorite or "createdAt" not in favorite:
                print(f"Favori incomplet : {favorite}")
                continue  # Ignorer les entrées de favoris incomplètes
            
            # Extraire les données nécessaires
            user_id = str(favorite["user"])
            product_id = str(favorite["product"])
            
            # Convertir datetime en format ISO ou timestamp Unix
            if isinstance(favorite["createdAt"], datetime.datetime):
                timestamp = favorite["createdAt"].isoformat()
            else:
                timestamp = favorite["createdAt"]  # Utiliser tel quel si ce n'est pas un datetime
            
            # Utiliser AddDetailView pour enregistrer l'interaction "favori"
            request = AddDetailView(
                user_id=user_id,
                item_id=product_id,
                timestamp=timestamp
            )
            
            # Envoi des données à Recombee
            response = client.send(request)
            print(f"Favori synchronisé avec Recombee pour l'utilisateur {user_id} et produit {product_id}")
            print(f"Réponse de Recombee : {response}")
        
        except KeyError as e:
            print(f"Erreur: Clé manquante dans le favori - {e}")
        except Exception as e:
            print(f"Erreur lors de la synchronisation du favori {favorite} : {e}")
            
def sync_order_to_recombee(order_data):
    try:
        # Synchroniser chaque commande dans Recombee
        for item in order_data.items:
            # Création de la demande AddPurchase sans le paramètre properties
            request = AddPurchase(
                order_data.user_id,  # ID de l'utilisateur
                item.product,        # ID du produit
                amount=1,            # Quantité d'articles achetés (par défaut 1)
                price=item.price,    # Prix du produit
                timestamp=order_data.created_at  # Date de la commande
            )
            
            # Ajouter les propriétés séparément si l'API le permet
            # Par exemple, certaines API utilisent une méthode comme set_property ou add_property
            if hasattr(request, "set_property"):
                request.set_property("shipping_address", order_data.shipping_address)
            
            # Envoyer la requête vers Recombee
            response = client.send(request)
            print(f"Commande synchronisée pour l'utilisateur {order_data.user_id} avec le produit {item.product}")
            print(f"Réponse de Recombee : {response}")

    except Exception as e:
        print(f"Erreur de synchronisation de la commande {order_data.user_id} : {e}")

def sync_orders_to_recombee():
    orders = db["orders"].find()
    for order in orders:
        try:
            # Vérifie la présence des champs nécessaires
            if "user" not in order or "items" not in order or "createdAt" not in order:
                print(f"Commande incomplète ignorée : {order}")
                continue

            # Créer l'objet order_data avec la structure correcte
            order_data = Order(
                user_id=str(order["user"]),
                created_at=str(order["createdAt"]),
                total=order["total"],  # Ajouter le total
                shipping_address=order["shippingAddress"],  # Ajouter l'adresse de livraison
                items=[
                    OrderItem(
                        product=str(item["product"]),  # ID du produit
                        price=item["price"],  # Prix du produit
                        seller=str(item.get("seller", "inconnu"))  # Si 'seller' est manquant, on met "inconnu"
                    )
                    for item in order["items"]
                    if "product" in item and "price" in item  # Vérifier la validité des items
                ]
            )

            # Si aucun item valide n'est trouvé, ignorer la commande
            if not order_data.items:
                print(f"Aucun item valide dans la commande : {order}")
                continue

            # Synchroniser la commande avec Recombee
            sync_order_to_recombee(order_data)

        except Exception as e:
            print(f"Erreur lors de la synchronisation de la commande {order.get('user', 'Inconnu')} : {e}")
