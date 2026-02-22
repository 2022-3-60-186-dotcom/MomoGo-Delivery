import chickenMomo from '@/assets/chicken-momo.jpg';
import vegMomo from '@/assets/veg-momo.jpg';
import buffMomo from '@/assets/buff-momo.jpg';
import friedMomo from '@/assets/fried-momo.jpg';
import { MenuItem } from '@/types/menu';

export const menuItems: MenuItem[] = [
  {
    id: 'chicken-steam',
    name: 'Chicken Momo',
    description: 'Juicy chicken filling wrapped in soft dough, steamed to perfection. Served with signature tomato chutney.',
    price: 150,
    image: chickenMomo,
    category: 'steam',
    isPopular: true,
  },
  {
    id: 'veg-steam',
    name: 'Vegetable Momo',
    description: 'Fresh seasonal vegetables with aromatic spices. A delightful vegetarian option.',
    price: 120,
    image: vegMomo,
    category: 'steam',
  },
  {
    id: 'buff-steam',
    name: 'Buff Momo',
    description: 'Traditional buffalo meat filling with authentic Nepali spices. Rich and flavorful.',
    price: 160,
    image: buffMomo,
    category: 'steam',
    isSpicy: true,
  },
  {
    id: 'chicken-fried',
    name: 'Fried Chicken Momo',
    description: 'Crispy golden fried momos with chicken filling. Perfect crunchy texture.',
    price: 180,
    image: friedMomo,
    category: 'fried',
    isPopular: true,
  },
  {
    id: 'veg-fried',
    name: 'Fried Vegetable Momo',
    description: 'Crispy fried vegetable momos with a golden crust. Served with spicy sauce.',
    price: 150,
    image: friedMomo,
    category: 'fried',
  },
  {
    id: 'buff-fried',
    name: 'Fried Buff Momo',
    description: 'Crispy fried buffalo momos with authentic spices. Extra crunchy goodness.',
    price: 190,
    image: friedMomo,
    category: 'fried',
    isSpicy: true,
  },
  {
    id: 'jhol-momo',
    name: 'Jhol Momo',
    description: 'Steamed momos dipped in spicy sesame-tomato soup. Our signature specialty!',
    price: 180,
    image: buffMomo,
    category: 'special',
    isPopular: true,
    isSpicy: true,
  },
  {
    id: 'chilli-momo',
    name: 'Chilli Momo',
    description: 'Fried momos tossed in spicy chilli sauce with bell peppers and onions.',
    price: 200,
    image: friedMomo,
    category: 'special',
    isSpicy: true,
  },
];

export const categories = [
  { id: 'all', name: 'All Items' },
  { id: 'steam', name: 'Steamed' },
  { id: 'fried', name: 'Fried' },
  { id: 'special', name: 'Special' },
];
