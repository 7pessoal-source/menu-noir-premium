export const storage = {
  get: (key: string) => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  },
  set: (key: string, value: any) => {
    localStorage.setItem(key, JSON.stringify(value));
  },
  
  // Helpers específicos
  getRestaurant: () => storage.get('restaurant') || {
    name: "Menu Noir",
    logo: "",
    whatsapp: "",
    hoursOfOperation: "Seg-Sex: 11h às 22h",
    status: "open"
  },
  setRestaurant: (data: any) => storage.set('restaurant', data),
  
  getCategories: () => storage.get('categories') || [],
  setCategories: (data: any) => storage.set('categories', data),
  
  getProducts: () => storage.get('products') || [],
  setProducts: (data: any) => storage.set('products', data),
};
