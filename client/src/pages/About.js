import React from 'react'
import Layout from '../components/Layout/Layout'

const About = () => {
  return (
    <Layout title={"About us - Ecommer app"}>
      <div className='main-content'>
        <div className="row contactus ">
          <div className="col-md-6 ">
            <img
              src="/images/aboutus.jpeg"
              alt="contactus"
              style={{ width: "100%" }}
            />
          </div>
          <div className="col-md-4">
            <p className="text-justify mt-2">
            Welcome to our site! We're your trusted online shopping destination, 
            bringing you a curated collection of high-quality products at unbeatable prices. 
            Our mission is to make your shopping experience simple, enjoyable, and rewarding. 
            With a passion for excellence, we're committed to offering you the latest trends and must-have items. 
            Thank you for choosing us for all your shopping needs.

            Feel free to customize this short "About Us" section to fit your brand's identity and voice. 
            The key is to convey your dedication to quality, affordability, and customer satisfaction in just a few sentences.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  )
};

export default About;