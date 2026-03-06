-- ==============================================
-- FATTY PATTY - SEED DATA
-- ==============================================

-- CATEGORIES
insert into public.categories (id, name, image, sort_order) values
  ('beef-burgers', 'Beef Burgers', '/images/beef-burger.jpg', 1),
  ('chicken-burgers', 'Chicken Burgers', '/images/chicken-burger.jpg', 2),
  ('starters', 'Starters', '/images/starters.jpg', 3),
  ('fries-specials', 'Fries Specials', '/images/fries.jpg', 4),
  ('bowls', 'Bowls', '/images/bowl.jpg', 5),
  ('pasta', 'Pasta', '/images/pasta.jpg', 6),
  ('drinks', 'Drinks', '/images/drinks.jpg', 7)
on conflict (id) do update set
  name = excluded.name,
  image = excluded.image,
  sort_order = excluded.sort_order;

-- MENU ITEMS - Starters
insert into public.menu_items (id, name, description, price, category_id, image, is_popular, rating) values
  ('s1', 'Crispy Chicken Wings', 'Golden fried chicken wings with our signature dipping sauce', 600, 'starters', '/images/starters.jpg', false, 4.6),
  ('s2', 'Crispy Chicken Tender', 'Hand-breaded chicken tenders, crispy and juicy', 600, 'starters', '/images/starters.jpg', false, 4.5),
  ('s3', 'Mushroom Cheese Fries', 'Loaded fries with sauteed mushrooms and melted cheese', 650, 'starters', '/images/fries.jpg', false, 4.7),
  ('s4', 'Jalapeno Fries', 'Spicy loaded fries with fresh jalapenos and cheese sauce', 600, 'starters', '/images/fries.jpg', false, 4.4),
  ('s5', 'Fries', 'Classic golden crispy french fries', 300, 'starters', '/images/fries.jpg', false, 4.3),
  ('s6', 'Garlic Mayo Fries', 'Crispy fries tossed in house-made garlic mayo', 400, 'starters', '/images/fries.jpg', false, 4.5)
on conflict (id) do update set
  name = excluded.name,
  description = excluded.description,
  price = excluded.price,
  category_id = excluded.category_id,
  image = excluded.image,
  is_popular = excluded.is_popular,
  rating = excluded.rating;

-- MENU ITEMS - Chicken Burgers
insert into public.menu_items (id, name, description, price, category_id, image, is_popular, rating) values
  ('c1', 'Stuffed Chicken', 'Stuffed chicken breast with cheese, wrapped in crispy coating', 1200, 'chicken-burgers', '/images/chicken-burger.jpg', false, 4.8),
  ('c2', 'Chicken Jalapeno', 'Crispy chicken fillet with fresh jalapenos and spicy sauce', 750, 'chicken-burgers', '/images/chicken-burger.jpg', true, 4.7),
  ('c3', 'Crispy Chicken', 'Classic crispy fried chicken burger with fresh toppings', 750, 'chicken-burgers', '/images/chicken-burger.jpg', false, 4.5),
  ('c4', 'Chicken Signature', 'Our signature chicken burger with special Fatty Patty sauce', 750, 'chicken-burgers', '/images/chicken-burger.jpg', false, 4.6)
on conflict (id) do update set
  name = excluded.name,
  description = excluded.description,
  price = excluded.price,
  category_id = excluded.category_id,
  image = excluded.image,
  is_popular = excluded.is_popular,
  rating = excluded.rating;

-- MENU ITEMS - Beef Burgers
insert into public.menu_items (id, name, description, price, category_id, image, is_popular, rating) values
  ('b1', 'All American', 'Double smashed patty, American cheese, pickles, onions, special sauce', 1150, 'beef-burgers', '/images/beef-burger.jpg', true, 4.9),
  ('b2', 'Beef Signature', 'Our signature smashed beef burger with house sauce', 1000, 'beef-burgers', '/images/beef-burger.jpg', true, 4.8),
  ('b3', 'Beef Jalapeno', 'Smashed beef patty loaded with fresh jalapenos and pepper jack', 800, 'beef-burgers', '/images/beef-burger.jpg', false, 4.6),
  ('b4', 'Beef Classic', 'The classic smashed burger with cheese, lettuce, and tomato', 800, 'beef-burgers', '/images/beef-burger.jpg', false, 4.5),
  ('b5', 'Classic Wagyu', 'Premium wagyu beef patty, truffle mayo, aged cheddar, caramelized onions', 2800, 'beef-burgers', '/images/beef-burger.jpg', true, 5.0),
  ('b6', 'Beef Bacon', 'Smashed beef with crispy bacon strips and smoky BBQ sauce', 1100, 'beef-burgers', '/images/beef-burger.jpg', false, 4.7),
  ('b7', 'Red Mushroom', 'Beef patty topped with sauteed mushrooms and Swiss cheese', 900, 'beef-burgers', '/images/beef-burger.jpg', false, 4.6)
on conflict (id) do update set
  name = excluded.name,
  description = excluded.description,
  price = excluded.price,
  category_id = excluded.category_id,
  image = excluded.image,
  is_popular = excluded.is_popular,
  rating = excluded.rating;

-- MENU ITEMS - Bowls
insert into public.menu_items (id, name, description, price, category_id, image, is_popular, rating) values
  ('bo1', 'Moroccan Chicken Bowl', 'Spiced Moroccan chicken with rice, roasted veggies and tahini', 1200, 'bowls', '/images/bowl.jpg', true, 4.8),
  ('bo2', 'Korean Chicken Bowl', 'Korean style crispy chicken with gochujang sauce and pickled vegetables', 1200, 'bowls', '/images/bowl.jpg', false, 4.7)
on conflict (id) do update set
  name = excluded.name,
  description = excluded.description,
  price = excluded.price,
  category_id = excluded.category_id,
  image = excluded.image,
  is_popular = excluded.is_popular,
  rating = excluded.rating;

-- MENU ITEMS - Pasta
insert into public.menu_items (id, name, description, price, category_id, image, is_popular, rating) values
  ('p1', 'Alfredo Pasta Bowl', 'Creamy Alfredo pasta with grilled chicken and parmesan', 1200, 'pasta', '/images/pasta.jpg', false, 4.6)
on conflict (id) do update set
  name = excluded.name,
  description = excluded.description,
  price = excluded.price,
  category_id = excluded.category_id,
  image = excluded.image,
  is_popular = excluded.is_popular,
  rating = excluded.rating;

-- MENU ITEMS - Fries Specials
insert into public.menu_items (id, name, description, price, category_id, image, is_popular, rating) values
  ('f1', 'Fatty Fries', 'Our signature loaded fries with double cheese and special toppings', 850, 'fries-specials', '/images/fries.jpg', true, 4.9),
  ('f2', 'Moroccan Fries', 'Loaded fries with Moroccan spiced chicken and sauces', 850, 'fries-specials', '/images/fries.jpg', false, 4.7)
on conflict (id) do update set
  name = excluded.name,
  description = excluded.description,
  price = excluded.price,
  category_id = excluded.category_id,
  image = excluded.image,
  is_popular = excluded.is_popular,
  rating = excluded.rating;

-- MENU ITEMS - Drinks
insert into public.menu_items (id, name, description, price, category_id, image, is_popular, rating) values
  ('d1', 'Mineral Water', 'Chilled mineral water bottle', 100, 'drinks', '/images/drinks.jpg', false, 4.0),
  ('d2', 'Cold Drink', 'Choice of Pepsi, 7UP, or Mirinda', 150, 'drinks', '/images/drinks.jpg', false, 4.2)
on conflict (id) do update set
  name = excluded.name,
  description = excluded.description,
  price = excluded.price,
  category_id = excluded.category_id,
  image = excluded.image,
  is_popular = excluded.is_popular,
  rating = excluded.rating;

-- ADD-ONS
insert into public.add_ons (id, name, price, category_type) values
  ('single-patty', 'Single Patty', 0, 'burger'),
  ('double-patty', 'Double Patty', 350, 'burger'),
  ('extra-cheese', 'Extra Cheese', 100, 'burger'),
  ('extra-sauce', 'Extra Sauce', 50, 'burger'),
  ('add-fries', 'Fries', 300, 'burger'),
  ('add-cold-drink', 'Cold Drink', 150, 'all')
on conflict (id) do update set
  name = excluded.name,
  price = excluded.price,
  category_type = excluded.category_type;

-- DRINK OPTIONS
insert into public.drink_options (id, name) values
  ('pepsi', 'Pepsi'),
  ('7up', '7UP'),
  ('mirinda', 'Mirinda')
on conflict (id) do update set name = excluded.name;

-- DEALS
insert into public.deals (id, name, title, items, price, image, sort_order) values
  ('deal-1', 'Deal 1', 'Classic Crunch Combo', ARRAY['1 Crispy Chicken Burger', '1 Fries', '1 Cold Drink'], 1200, '/images/chicken-burger.jpg', 1),
  ('deal-2', 'Deal 2', 'Duo Box', ARRAY['2 Crispy Chicken Burgers', '2 Fries', '2 Cold Drinks'], 2000, '/images/chicken-burger.jpg', 2),
  ('deal-3', 'Deal 3', 'Italian Fusion Deal', ARRAY['1 Alfredo Pasta Bowl', '1 Stuffed Chicken Burger', '1 Fries', '1 Cold Drink'], 1700, '/images/pasta.jpg', 3),
  ('deal-4', 'Deal 4', 'Family Feast Box', ARRAY['3 Crispy Chicken Burgers', '2 Fries', '3 Cold Drinks'], 2800, '/images/beef-burger.jpg', 4)
on conflict (id) do update set
  name = excluded.name,
  title = excluded.title,
  items = excluded.items,
  price = excluded.price,
  image = excluded.image,
  sort_order = excluded.sort_order;

-- BRANCHES
insert into public.branches (id, name, address) values
  ('dha-phase-8', 'DHA Phase 8', 'Creek Walk, DHA Phase 8, Karachi'),
  ('tipu-sultan', 'Tipu Sultan', 'Habit City, Tipu Sultan Road, Karachi')
on conflict (id) do update set
  name = excluded.name,
  address = excluded.address;

-- DELIVERY AREAS
insert into public.delivery_areas (name) values
  ('DHA Phase 8'),
  ('DHA Phase 7'),
  ('DHA Phase 6'),
  ('DHA Phase 5'),
  ('Creek Walk - DHA Phase 8'),
  ('Khayaban-e-Ittehad'),
  ('Bukhari Commercial'),
  ('Tipu Sultan Road'),
  ('Habit City - Tipu Sultan'),
  ('Bahadurabad'),
  ('Shaheed-e-Millat'),
  ('PECHS'),
  ('Tariq Road'),
  ('Nursery'),
  ('KDA Scheme 1'),
  ('Gulshan-e-Iqbal Block 13/14'),
  ('Clifton'),
  ('Bath Island'),
  ('Defence Phase 4'),
  ('Defence Phase 3'),
  ('Defence Phase 2'),
  ('Zamzama'),
  ('Khadda Market'),
  ('Boat Basin'),
  ('Sindhi Muslim Society'),
  ('Smchs')
on conflict (name) do nothing;
