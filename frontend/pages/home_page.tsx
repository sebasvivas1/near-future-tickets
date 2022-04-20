import HomePage from "../components/HomePage/HomePage";
import Layout from "../components/Landing/Layout";

export default function home() {
  return (
    <div className="min-h-screen min-w-screen bg-figma-200">
         <Layout>
    <HomePage></HomePage>
    </Layout>   
    </div>
      
  );
}