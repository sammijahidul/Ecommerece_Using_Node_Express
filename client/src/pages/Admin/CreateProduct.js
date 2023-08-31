import React, {useState, useEffect} from 'react'
import Layout from '../../components/Layout/Layout'
import AdminMenu from '../../components/Layout/AdminMenu'
import axios from 'axios'
import toast from 'react-hot-toast'
import {Select} from 'antd'
import {useNavigate} from 'react-router-dom'

const {Option} = Select

const CreateProduct = () => {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [photo, setPhoto] = useState("")
  const [name, setname] = useState("")
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [quantity, setQuantity] = useState("")
  const [shipping, setShipping] = useState("")

  //get all categories
  const getAllCategory = async () => {
    try {
      const {data} = await axios.get('/api/v1/category/get-category')
      if(data?.success) {
        setCategories(data?.category);
      }      
    } catch (error) {
        console.log(error);
        toast.error('Something went wrong while getting categories')
    }
  };
  useEffect (() => {
    getAllCategory();
  }, []);

  // Create product function
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const productData = new FormData()
      productData.append("name", name)
      productData.append("description", description)
      productData.append("price", price)
      productData.append("quantity", quantity)
      productData.append("category", category)
      productData.append("photo", photo)
      const {data} = axios.post('/api/v1/product/create-product',  productData)
      
      if(data?.success) {
        toast.error(data?.message)
      } else {
        toast.success('Product created successfully')
        navigate('/dashboard/admin/products')
      }     
    } catch (error) {
        console.log(error)
        toast.error('Error while submitting')
    }
  }

  return (
    <Layout title={'Dashboard - Create Product'}>
      <div className='container-fluid m-3 p-3' >
        <div className='row'>
            <div className='col-md-3'>
                <AdminMenu/>
            </div>
            <div className='col-md-9'>
                <h1>Create Product</h1>
                <div>
                  <Select 
                      bordered={false} 
                      placeholder='Select a category'
                      size='large'
                      showSearch 
                      className='form-select mb-3' 
                      onChange={(value) => {
                        setCategory(value)
                      }} >
                      {categories?.map(c => (
                        <Option key={c._id} value={c._id}>
                          {c.name}
                        </Option>
                      ))}
                  </Select>
                  <div className='mb-3'>
                    <label className='btn btn-outline-secondary col-md-12'>
                        {photo ? photo.name : "Upload Photo"} 
                        <input 
                            type='file' 
                            name='photo' 
                            accept='image/*' 
                            onChange={(e) => setPhoto(e.target.files[0])}
                            hidden
                        />
                    </label>                   
                  </div>
                  <div className='mb-3'>
                    {photo && (
                      <div className='text-center'>
                        <img 
                          src={URL.createObjectURL(photo)} 
                          alt='product_photo' 
                          height={'200px'} 
                          className='img img-responsive'
                        />
                      </div>
                    )}
                  </div>
                  <div className='mb-3'>
                    <input 
                      type='text'
                      value={name}
                      placeholder='Write a name'
                      className='form-control'
                      onChange={(e) => setname(e.target.value)}
                    />
                  </div>
                  <div className='mb-3'>
                    <textarea 
                      type='text'
                      value={description}
                      placeholder='Write a description'
                      className='form-control'
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                  <div className='mb-3'>
                    <input 
                      type='number'
                      value={price}
                      placeholder='Assign the price'
                      className='form-control'
                      onChange={(e) => setPrice(e.target.value)}
                    />
                  </div>
                  <div className='mb-3'>
                    <input 
                      type='number'
                      value={quantity}
                      placeholder='Assign the quantity'
                      className='form-control'
                      onChange={(e) => setQuantity(e.target.value)}
                    />
                  </div>
                  <div className='mb-3'>
                    <Select
                      bordered={false}
                      placeholder='Select Shipping'
                      size='large'
                      showSearch
                      className='form-control mb-3'
                      onChange={(value) => {
                        setShipping(value);
                      }}
                      >
                        <Option value="0">No</Option>
                        <Option value="1">Yes</Option>
                    </Select>
                  </div>
                  <div className='mb-3'>
                    <button 
                      className='btn btn-primary'
                      onClick={handleSubmit}
                      >Create Product
                    </button>
                  </div>
                </div>
            </div>
        </div>
      </div>  
    </Layout>   
  )
}

export default CreateProduct