import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Download from "./pages/Download";
import NotFound from "./pages/NotFound";
import About from './pages/About'
import Features from './pages/Features'
import Pricing from './pages/Pricing'
import Blog from './pages/Blog'
import Contact from './pages/Contact'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import FAQPage from './pages/FAQPage'
import ForCreators from './pages/ForCreators'
import ForTesters from './pages/ForTesters'
import Docs from './pages/Docs'

const App = () => (
	<BrowserRouter>
		<Routes>
			<Route path='/' element={<Index />} />
			<Route path='/download' element={<Download />} />
			<Route path='/about' element={<About />} />
			<Route path='/features' element={<Features />} />
			<Route path='/pricing' element={<Pricing />} />
			<Route path='/blog' element={<Blog />} />
			<Route path='/contact' element={<Contact />} />
			<Route path='/privacy' element={<Privacy />} />
			<Route path='/terms' element={<Terms />} />
			<Route path='/faq' element={<FAQPage />} />
			<Route path='/for-creators' element={<ForCreators />} />
			<Route path='/for-testers' element={<ForTesters />} />
			<Route path='/docs' element={<Docs />} />
			<Route path='*' element={<NotFound />} />
		</Routes>
	</BrowserRouter>
)

export default App;

