// Author
// YAO YIYANG A0294873L
import React, { useState, useEffect } from 'react';
import { Plus, Trash, Edit } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function ProductList() {
  const [currentPage, setCurrentPage] = useState(1); // set pages
  const [productsPerPage, setProductsPerPage] = useState(5);
  const [products, setProducts] = useState([]);  // store all products
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [categories, setCategories] = useState([]); // store all categories
  const navigate = useNavigate();
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    description: '',
    stock: '',
    categoryId: '',
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);  // store edit product

  // check the session - finish
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await axios.get('/users/session', { withCredentials: true });
        console.log(response);
        if (response.status !== 200) {
          navigate('/signin'); 
        }
        if (response.data.data.role !== 'ADMIN'){
          navigate('/gallery')
        }
      } catch (error) {
        navigate('/signin');
      }
    };
    checkSession();
  }, [navigate]);

  // define a function to fetchProducts
  // get all prodcuts from backend - finish
  const fetchProducts = async () =>{
    try {
      const response = await axios.get('/product/all'); 
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }

  // Fetch all products
  useEffect(() => {
    fetchProducts();
  }, []);

  // Fetch all categories
  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await axios.get('/category/all');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    }
    fetchCategories();
  }, []);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });  // 确保字段名对应 newProduct 的键
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setNewProduct({ ...newProduct, image: file });
    setImagePreview(URL.createObjectURL(file));
  };

  // create product - finish
  const handleAddProduct = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append('name', newProduct.name);  // ensure name exist
    formData.append('price', newProduct.price);
    formData.append('description', newProduct.description);
    formData.append('stock', newProduct.stock);
    formData.append('categoryId', newProduct.categoryId);  // add categoryId
    formData.append('image', newProduct.image);
  
    try {
      const response = await axios.post('/product/add', formData);
      if (response.status === 201) {
        setIsAddModalOpen(false);
        setNewProduct({
          name: '',
          price: '',
          description: '',
          stock: '',
          categoryId: '',
          image: null,
        });
        setImagePreview(null);
        fetchProducts();  // fresh this page and get data again
      }
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  // delete product
  const handleDeleteProduct = async (productId) => {
    try {
      const response = await axios.delete(`/product/delete/${productId}`);
      if (response.status === 200) {
        fetchProducts();  // 
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  // edit product
  const handleEditProduct = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', newProduct.name);
    formData.append('price', newProduct.price);
    formData.append('description', newProduct.description);
    formData.append('stock', newProduct.stock);
    formData.append('categoryId', newProduct.categoryId);
    if (newProduct.image) {
      formData.append('image', newProduct.image);
    }

    try {
      const response = await axios.put(`/product/update/${editingProduct.id}`, formData);
      if (response.status === 200) {
        setIsEditModalOpen(false);
        setNewProduct({
          name: '',
          price: '',
          description: '',
          stock: '',
          categoryId: '',
          image: null,
        });
        setImagePreview(null);
        fetchProducts();
      }
    } catch (error) {
      console.error('Error editing product:', error);
    }
  };

  // get product 
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="p-6 border-b flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">Product List</h2>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-300 flex items-center">
            <Plus size={20} />
            <span className="ml-2">Add Product</span>
          </button>
        </div>
      </div>

      {/* product list */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentProducts.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <img src={`http://localhost:8080${product.imageUrl}`} alt={product.name} className="h-10 w-10 object-cover" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{product.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{product.price}</td>
                <td className="px-6 py-4 whitespace-nowrap">{product.category.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{product.stock}</td>
                <td className="px-6 py-4 whitespace-nowrap">{product.description}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button 
                    onClick={() => { 
                      setEditingProduct(product);
                      setIsEditModalOpen(true); 
                      setNewProduct({
                        name: product.name,
                        price: product.price,
                        description: product.description,
                        stock: product.stock,
                        categoryId: product.categoryId,
                        image: null,
                      });
                    }}
                    className="bg-yellow-500 text-white px-2 py-1 rounded-md hover:bg-yellow-600 mr-2">
                    <Edit size={16} />
                  </button>
                  <button 
                    onClick={() => handleDeleteProduct(product.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600">
                    <Trash size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-4 flex justify-between items-center border-t">
        <span>Showing {indexOfFirstProduct + 1} to {Math.min(indexOfLastProduct, products.length)} of {products.length} products</span>
        <div>
          {Array.from({ length: Math.ceil(products.length / productsPerPage) }, (_, i) => (
            <button
              key={i}
              onClick={() => paginate(i + 1)}
              className={`mx-1 px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* add product */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-2xl font-semibold mb-6">Add New Product</h2>
            <form onSubmit={handleAddProduct}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={newProduct.name}
                    onChange={handleInputChange}
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter product name"/>
                </div>
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                  <input
                    id="price"
                    type="number"
                    name="price"
                    value={newProduct.price}
                    onChange={handleInputChange}
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter price"/>
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={newProduct.description}
                    onChange={handleInputChange}
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter product description"
                    rows="3"></textarea>
                </div>
                <div>
                  <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                  <input
                    id="stock"
                    type="number"
                    name="stock"
                    value={newProduct.stock}
                    onChange={handleInputChange}
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter stock quantity"/>
                </div>
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    id="categoryId"
                    name="categoryId"  // 修改为 categoryId
                    value={newProduct.categoryId}
                    onChange={handleInputChange}
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required>
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>  {/* 使用 category.id */}
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
                  <input
                    id="image"
                    type="file"
                    onChange={handleImageUpload}
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    accept="image/*"/>
                  {imagePreview && (
                    <img src={imagePreview} alt="Preview" className="mt-2 h-32 w-32 object-cover rounded-md" />
                  )}
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setNewProduct({ name: '', price: '', description: '', stock: '', categoryId: '', image: null });
                    setImagePreview(null);
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors duration-300">
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-300">
                  Add Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* edit product */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-2xl font-semibold mb-6">Edit Product</h2>
            <form onSubmit={handleEditProduct}>
              <div className="space-y-4">
                {/* 与添加商品类似，重用表单 */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={newProduct.name}
                    onChange={handleInputChange}
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter product name"/>
                </div>
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                  <input
                    id="price"
                    type="number"
                    name="price"
                    value={newProduct.price}
                    onChange={handleInputChange}
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter price"/>
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={newProduct.description}
                    onChange={handleInputChange}
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter product description"
                    rows="3"></textarea>
                </div>
                <div>
                  <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                  <input
                    id="stock"
                    type="number"
                    name="stock"
                    value={newProduct.stock}
                    onChange={handleInputChange}
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter stock quantity"/>
                </div>
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    id="categoryId"
                    name="categoryId"  // 修改为 categoryId
                    value={newProduct.categoryId}
                    onChange={handleInputChange}
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required>
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>  {/* 使用 category.id */}
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
                  <input
                    id="image"
                    type="file"
                    onChange={handleImageUpload}
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    accept="image/*"/>
                  {imagePreview && (
                    <img src={imagePreview} alt="Preview" className="mt-2 h-32 w-32 object-cover rounded-md" />
                  )}
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setNewProduct({ name: '', price: '', description: '', stock: '', categoryId: '', image: null });
                    setImagePreview(null);
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors duration-300">
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-300">
                  Update Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
