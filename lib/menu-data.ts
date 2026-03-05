export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: string
  image: string
  popular?: boolean
  rating: number
}

export interface Category {
  id: string
  name: string
  image: string
  count: number
}

export const categories: Category[] = [
  { id: 'beef-burgers', name: 'Beef Burgers', image: '/images/beef-burger.jpg', count: 7 },
  { id: 'chicken-burgers', name: 'Chicken Burgers', image: '/images/chicken-burger.jpg', count: 4 },
  { id: 'starters', name: 'Starters', image: '/images/starters.jpg', count: 6 },
  { id: 'fries-specials', name: 'Fries Specials', image: '/images/fries.jpg', count: 2 },
  { id: 'bowls', name: 'Bowls', image: '/images/bowl.jpg', count: 2 },
  { id: 'pasta', name: 'Pasta', image: '/images/pasta.jpg', count: 1 },
  { id: 'drinks', name: 'Drinks', image: '/images/drinks.jpg', count: 2 },
]

export const menuItems: MenuItem[] = [
  // Starters
  { id: 's1', name: 'Crispy Chicken Wings', description: 'Golden fried chicken wings with our signature dipping sauce', price: 600, category: 'starters', image: '/images/starters.jpg', rating: 4.6 },
  { id: 's2', name: 'Crispy Chicken Tender', description: 'Hand-breaded chicken tenders, crispy and juicy', price: 600, category: 'starters', image: '/images/starters.jpg', rating: 4.5 },
  { id: 's3', name: 'Mushroom Cheese Fries', description: 'Loaded fries with sauteed mushrooms and melted cheese', price: 650, category: 'starters', image: '/images/fries.jpg', rating: 4.7 },
  { id: 's4', name: 'Jalapeno Fries', description: 'Spicy loaded fries with fresh jalapenos and cheese sauce', price: 600, category: 'starters', image: '/images/fries.jpg', rating: 4.4 },
  { id: 's5', name: 'Fries', description: 'Classic golden crispy french fries', price: 300, category: 'starters', image: '/images/fries.jpg', rating: 4.3 },
  { id: 's6', name: 'Garlic Mayo Fries', description: 'Crispy fries tossed in house-made garlic mayo', price: 400, category: 'starters', image: '/images/fries.jpg', rating: 4.5 },

  // Chicken Burgers
  { id: 'c1', name: 'Stuffed Chicken', description: 'Stuffed chicken breast with cheese, wrapped in crispy coating', price: 1200, category: 'chicken-burgers', image: '/images/chicken-burger.jpg', rating: 4.8 },
  { id: 'c2', name: 'Chicken Jalapeno', description: 'Crispy chicken fillet with fresh jalapenos and spicy sauce', price: 750, category: 'chicken-burgers', image: '/images/chicken-burger.jpg', popular: true, rating: 4.7 },
  { id: 'c3', name: 'Crispy Chicken', description: 'Classic crispy fried chicken burger with fresh toppings', price: 750, category: 'chicken-burgers', image: '/images/chicken-burger.jpg', rating: 4.5 },
  { id: 'c4', name: 'Chicken Signature', description: 'Our signature chicken burger with special Fatty Patty sauce', price: 750, category: 'chicken-burgers', image: '/images/chicken-burger.jpg', rating: 4.6 },

  // Beef Burgers
  { id: 'b1', name: 'All American', description: 'Double smashed patty, American cheese, pickles, onions, special sauce', price: 1150, category: 'beef-burgers', image: '/images/beef-burger.jpg', popular: true, rating: 4.9 },
  { id: 'b2', name: 'Beef Signature', description: 'Our signature smashed beef burger with house sauce', price: 1000, category: 'beef-burgers', image: '/images/beef-burger.jpg', popular: true, rating: 4.8 },
  { id: 'b3', name: 'Beef Jalapeno', description: 'Smashed beef patty loaded with fresh jalapenos and pepper jack', price: 800, category: 'beef-burgers', image: '/images/beef-burger.jpg', rating: 4.6 },
  { id: 'b4', name: 'Beef Classic', description: 'The classic smashed burger with cheese, lettuce, and tomato', price: 800, category: 'beef-burgers', image: '/images/beef-burger.jpg', rating: 4.5 },
  { id: 'b5', name: 'Classic Wagyu', description: 'Premium wagyu beef patty, truffle mayo, aged cheddar, caramelized onions', price: 2800, category: 'beef-burgers', image: '/images/beef-burger.jpg', popular: true, rating: 5.0 },
  { id: 'b6', name: 'Beef Bacon', description: 'Smashed beef with crispy bacon strips and smoky BBQ sauce', price: 1100, category: 'beef-burgers', image: '/images/beef-burger.jpg', rating: 4.7 },
  { id: 'b7', name: 'Red Mushroom', description: 'Beef patty topped with sauteed mushrooms and Swiss cheese', price: 900, category: 'beef-burgers', image: '/images/beef-burger.jpg', rating: 4.6 },

  // Bowls
  { id: 'bo1', name: 'Moroccan Chicken Bowl', description: 'Spiced Moroccan chicken with rice, roasted veggies and tahini', price: 1200, category: 'bowls', image: '/images/bowl.jpg', popular: true, rating: 4.8 },
  { id: 'bo2', name: 'Korean Chicken Bowl', description: 'Korean style crispy chicken with gochujang sauce and pickled vegetables', price: 1200, category: 'bowls', image: '/images/bowl.jpg', rating: 4.7 },

  // Pasta
  { id: 'p1', name: 'Alfredo Pasta Bowl', description: 'Creamy Alfredo pasta with grilled chicken and parmesan', price: 1200, category: 'pasta', image: '/images/pasta.jpg', rating: 4.6 },

  // Fries Specials
  { id: 'f1', name: 'Fatty Fries', description: 'Our signature loaded fries with double cheese and special toppings', price: 850, category: 'fries-specials', image: '/images/fries.jpg', popular: true, rating: 4.9 },
  { id: 'f2', name: 'Moroccan Fries', description: 'Loaded fries with Moroccan spiced chicken and sauces', price: 850, category: 'fries-specials', image: '/images/fries.jpg', rating: 4.7 },

  // Drinks
  { id: 'd1', name: 'Mineral Water', description: 'Chilled mineral water bottle', price: 100, category: 'drinks', image: '/images/drinks.jpg', rating: 4.0 },
  { id: 'd2', name: 'Soft Drink', description: 'Choice of Coca-Cola, Pepsi, Sprite, or Fanta', price: 150, category: 'drinks', image: '/images/drinks.jpg', rating: 4.2 },
]

export const addOns = [
  { id: 'extra-patty', name: 'Extra Patty', price: 350 },
  { id: 'extra-cheese', name: 'Extra Cheese', price: 100 },
  { id: 'extra-bacon', name: 'Extra Bacon', price: 350 },
  { id: 'extra-chicken', name: 'Extra Chicken', price: 300 },
  { id: 'extra-rice', name: 'Extra Rice', price: 100 },
  { id: 'make-it-meal', name: 'Make It A Meal (Fries + Drink)', price: 300 },
]

export const popularItems = menuItems.filter(item => item.popular)
