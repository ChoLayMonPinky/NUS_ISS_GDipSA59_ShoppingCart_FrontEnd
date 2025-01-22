import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function CategoryManagement() {
    const [categories, setCategories] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [categoriesPerPage, setCategoriesPerPage] = useState(5);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [newCategory, setNewCategory] = useState({
        name: '',
        description: ''
    });
    const [editingCategory, setEditingCategory] = useState(null);
    const navigate = useNavigate();

    // Fetch categories from the backend
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/category/all');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching category:', error);
      }
    }

    // get categories method - finish
    useEffect(() => {
      fetchCategories();
    }, []);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewCategory({ ...newCategory, [name]: value });
    };

    // add categories method - finish
    const handleAddCategory = async (e) => {
        e.preventDefault();
        try {
        const response = await axios.post('/category/add', newCategory);
        if (response.status === 200) {
            setCategories([...categories, response.data]);
            setNewCategory({ name: '', description: '' });
            setIsAddModalOpen(false);
            fetchCategories();
            navigate('/admin/categories');
        }
        } catch (error) {
          console.error('can\'t add category', error);
        }
    };

    // edit categories method - finish
    const handleEditCategory = async (e) => {
        e.preventDefault();
        
        try {
        // 发送 PUT 请求到后端更新类别
        const response = await axios.put(`/category/update/${editingCategory.id}`, {
            name: newCategory.name,
            description: newCategory.description,
        });
    
        if (response.status === 200) {
            // 更新状态中的类别列表
            setCategories(
            categories.map((cat) =>
                cat.id === editingCategory.id ? { ...cat, ...newCategory } : cat
            )
            );
            // 重置表单和状态
            setEditingCategory(null);
            setNewCategory({ name: '', description: '' });
            setIsEditModalOpen(false);
    
            // 跳转回类别列表页
            navigate('/admin/categories');
        }
        } catch (error) {
        console.error('编辑类别时发生错误:', error);
        }
    };

    // delete categories method
    const handleDeleteCategory = async (id) => {
        try {
        await axios.delete(`/category/delete/${id}`);
        setCategories(categories.filter((cat) => cat.id !== id));
        } catch (error) {
        console.error('删除类别时发生错误:', error);
        }
    };

    const handleOpenEditModal = (category) => {
        setEditingCategory(category);
        setNewCategory({ name: category.name, description: category.description });
        setIsEditModalOpen(true);
    };

  // 分页逻辑
  const indexOfLastCategory = currentPage * categoriesPerPage;
  const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
  const currentCategories = categories.slice(indexOfFirstCategory, indexOfLastCategory);

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="p-6 border-b flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">Category Management</h2>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-300 flex items-center"
        >
          <Plus size={20} />
          <span className="ml-2">Add Category</span>
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentCategories.map((category) => (
              <tr key={category.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">{category.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">{category.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{category.description}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleOpenEditModal(category)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-4 flex justify-between items-center border-t">
        <span>Showing {indexOfFirstCategory + 1} to {Math.min(indexOfLastCategory, categories.length)} of {categories.length} categories</span>
        <div>
          {Array.from({ length: Math.ceil(categories.length / categoriesPerPage) }, (_, i) => (
            <button
              key={i}
              onClick={() => paginate(i + 1)}
              className={`mx-1 px-3 py-1 rounded ${
                currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* 添加类别模态框 */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-2xl font-semibold mb-6">Add New Category</h2>
            <form onSubmit={handleAddCategory}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={newCategory.name}
                    onChange={handleInputChange}
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter category name"
                  />
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={newCategory.description}
                    onChange={handleInputChange}
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter category description"
                    rows="3"
                  ></textarea>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-300"
                >
                  Add Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 编辑类别模态框 */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-2xl font-semibold mb-6">Edit Category</h2>
            <form onSubmit={handleEditCategory}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={newCategory.name}
                    onChange={handleInputChange}
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter category name"
                  />
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={newCategory.description}
                    onChange={handleInputChange}
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter category description"
                    rows="3"
                  ></textarea>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-300"
                >
                  Update Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
