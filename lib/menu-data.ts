export type MenuItem = {
    name: string;
    description?: string;
};

export type MenuCategory = {
    title: string;
    subcategories?: {
        title: string;
        items: string[];
    }[];
    items?: string[];
};

export const fullMenu: MenuCategory[] = [
    {
        title: "Small Plates",
        subcategories: [
            {
                title: "Appetizers",
                items: [
                    "Spicy Edamame",
                    "Steamed Edamame",
                    "Duck Salad",
                    "Cucumber Tataki",
                    "A5 Wagyu Tacos",
                    "Salted Shishito Peppers",
                    "Crispy Rolls & Gyozas"
                ]
            },
            {
                title: "Black Cod & Crispy Rolls",
                items: [
                    "Black Cod & Crispy Rolls",
                    "King Crab Crispy Rolls"
                ]
            },
            {
                title: "Vegetables",
                items: [
                    "Mixed Dashi Mushrooms",
                    "Ginger Baby Bok Choy"
                ]
            }
        ]
    },
    {
        title: "Sushi & Sashimi",
        subcategories: [
            {
                title: "New Style Sashimi",
                items: [
                    "Hamachi Carpaccio & Truffle*",
                    "Yellowtail Cilantro*",
                    "Tuna Jalapeno*",
                    "Scallop and black truffle*",
                    "Sashimi Selection* 3-kind/5-kind",
                    "Nigiri Selection* 3-piece/5-piece"
                ]
            },
            {
                title: "Premium Sushi",
                items: [
                    "Salmon Toro*",
                    "A5 Wagyu & Foie Gras",
                    "Chu Toro & Caviar*",
                    "Seared O-Toro*",
                    "Truffle Hamachi & Smocked Bonito*",
                    "Spicy Toro & Caviar Gunkan*"
                ]
            }
        ]
    },
    {
        title: "Maki Rolls",
        subcategories: [
            {
                title: "Crispy Rolls And Gyozas",
                items: [
                    "Black Cod & Crispy Rolls",
                    "King Crab Crispy Rolls"
                ]
            },
            {
                title: "Maki",
                items: [
                    "Hamachi Yuzu Truffle*",
                    "Salmon Miso Truffle*",
                    "King Crab California",
                    "Ultimate Spicy Tuna*",
                    "Tiger Shrimp Tempura",
                    "Cucumber & Avocado"
                ]
            }
        ]
    },
    {
        title: "Signature Buns & Dim Sum",
        subcategories: [
            {
                title: "Dim Sums (4 Pieces)",
                items: [
                    "Shrimp & Cilantro",
                    "Wild Mushrooms",
                    "Black Truffle, Chicken & Morel",
                    "King Crab & Caviar",
                    "Spicy Prawn Moneybags"
                ]
            },
            {
                title: "Bao Buns",
                items: [
                    "Crispy Pork Belly",
                    "Peking Duck",
                    "Slow Braised Short Rib"
                ]
            }
        ]
    },
    {
        title: "Main Dishes",
        subcategories: [
            {
                title: "Entrees",
                items: [
                    "Yuzu Miso Wild Black Cod",
                    "Grilled Whole Lobster",
                    "Truffle A5 Wagyu & Wild Mushroom",
                    "Wagyu Ribeye* 12 oz"
                ]
            },
            {
                title: "Rices & Noodles",
                items: [
                    "Singapore Noodle",
                    "A5 Wagyu Cantonese Noodle",
                    "Peking Duck Fried Rice",
                    "Black Truffle & Mushroom Kamameshi"
                ]
            },
            {
                title: "Specialty",
                items: [
                    "Peking Duck"
                ]
            }
        ]
    }
];
