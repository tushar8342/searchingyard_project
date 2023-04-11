import { GetServerSideProps, NextPage } from 'next';
import { useState } from 'react';
type Product = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
  }
};

type HomeProps = {
  products: Product[];
};

const Home: NextPage<HomeProps> = ({ products }) => {
  // console.log(products)

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [sortBy, setSortBy] = useState('');

  const handleSearch = (searchTerm: string) => {
    setSearchTerm(searchTerm);
    const filtered = products.filter(
      (product) =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  const handleSortBy = (sortBy: string) => {
    setSortBy(sortBy);
    let sortedProducts = [...filteredProducts];

    if (sortBy === 'price-low-to-high') {
      sortedProducts.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high-to-low') {
      sortedProducts.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating-low-to-high') {
      sortedProducts.sort((a, b) => a.rating.rate - b.rating.rate);
    } else if (sortBy === 'rating-high-to-low') {
      sortedProducts.sort((a, b) => b.rating.rate - a.rating.rate);
    }
    setFilteredProducts(sortedProducts);
  };

  return (

    <div>
      <nav className="bg-gray-800 py-4">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search by product title"
                className="px-4 py-2 pr-8 bg-gray-700 text-white rounded-md focus:outline-none focus:bg-gray-900 w-full"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>

            <div className="relative">
              <select
                className="px-4 py-2 pr-8 bg-gray-700 text-white rounded-md focus:outline-none focus:bg-gray-90"
                value={sortBy}
                onChange={(e) => handleSortBy(e.target.value)}
              >
                <option value="">Sort By</option>
                <option value="price-low-to-high">Price: Low to High</option>
                <option value="price-high-to-low">Price: High to Low</option>
                <option value="rating-low-to-high">Rating: Low to High</option>
                <option value="rating-high-to-low">Rating: High to Low</option>
              </select>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {filteredProducts.map((product) => (
            <div className="bg-white p-4 shadow-lg rounded-md">
              <div className="flex justify-center items-center h-48 mb-4">
                <img
                  src={product.image}
                  alt={product.title}
                  className="object-cover h-full rounded-md"
                />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 ">{product.title}</h2>
              <p className="text-gray-700 mt-1 ">${product.price}</p>
              <p className="text-gray-500 mt-2 ">{product.category}</p>
              <div className="flex items-center mt-2">
                <p className="text-gray-600">Rating: </p>
                <div className="ml-2 flex items-center">
                  <span className="text-yellow-400 text-xl mr-1">★</span>
                  <p className="text-gray-600">{product.rating.rate}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
  try {
    const response = await fetch("https://fakestoreapi.com/products/category/women's%20clothing");
    const products = await response.json();

    return {
      props: {
        products,
      },
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      props: {
        products: [],
      },
    };
  }
};
