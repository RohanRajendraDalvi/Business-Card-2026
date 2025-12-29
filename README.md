# 3D Interactive Business Card

A stunning, interactive 3D business card built with React and Three.js. Features smooth animations, responsive design, and a toggleable light/dark theme.

---

## 👨‍💻 About Me

### Rohan Dalvi
**Software Engineer | AI Engineer | VR/XR Specialist**

> *"Startup-hardened. Enterprise-ready."*

I'm a passionate software engineer with a focus on building innovative solutions at the intersection of AI, extended reality, and full-stack development. A recent graduate with a Master's in Computer Science from Northeastern University, I bring a unique blend of academic excellence and real-world startup experience.

**🔍 Currently seeking full-time Software Engineer / AI Engineer / Full-Stack Developer opportunities.**

### 🎓 Education

| Degree | Institution |
|--------|-------------|
| **M.S. Computer Science** | Northeastern University, Boston |
| **B.E. Computer Engineering** | University of Mumbai, India |

### 💼 What Sets Me Apart

- 🚀 **Startup Veteran** - Battle-tested across 3 early-stage startups, thriving in fast-paced environments
- 👥 **Technical Leader** - Proven track record of mentoring teams and elevating collective performance
- 🔧 **Full-Stack Expertise** - From frontend interfaces to firmware-level programming
- 📚 **Published Author** - Research published through Francis & Taylor

### 🛠️ Technical Skills

**Languages**
```
Java • TypeScript • Python • Kotlin • Swift • C/C++/C#
```

**Frameworks & Tools**
```
React • React Native • Flutter • Node.js • Angular • Express • SQL/NoSQL
```

**AI & Machine Learning**
```
PyTorch • TensorFlow • LangChain • OpenCV • FAISS • Hugging Face
```

### 🎯 Specializations

- **AR/VR Development** - Building immersive experiences for next-gen devices
- **Real-time ML Systems** - Live captioning and inference pipelines
- **WebRTC Solutions** - Video interview and communication platforms
- **Cross-platform Mobile** - Native-quality apps for iOS and Android

### 📜 Certifications

- ☁️ AWS Cloud Architect
- 🤖 Amazon ML Engineer
- 🌐 Google Cloud Certified
- 🔐 Cyber Security + Information Security

### 🌟 What I Bring to Teams

- **Adaptability** - Quickly mastering diverse tech stacks and domains
- **Leadership** - Elevating team performance through mentorship
- **Delivery Focus** - Building solutions that ship and scale
- **Communication** - Bridging gaps between technical and business stakeholders

### 📫 Let's Connect!

| Platform | Link |
|----------|------|
| 📧 Email | [dalvi.ro@northeastern.edu](mailto:dalvi.ro@northeastern.edu) |
| 💼 LinkedIn | [linkedin.com/in/rohan-dalvi-3848771b8](https://linkedin.com/in/rohan-dalvi-3848771b8) |
| 🐙 GitHub | [github.com/RohanRajendraDalvi](https://github.com/RohanRajendraDalvi) |
| 🌐 Portfolio | [rohandalvi.vercel.app](https://rohandalvi.vercel.app) |
| 📱 Phone | +1 (857) 313-1819 |

### 📍 Availability

Based in **Boston, MA** | **Ready to start immediately** | **Open to relocation**

---

> 💼 **Actively looking for Software Engineer, AI Engineer, or Full-Stack Developer roles.** If you're hiring or know of opportunities, I'd love to connect!

---

![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react)
![Three.js](https://img.shields.io/badge/Three.js-r128-black?logo=three.js)
![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?logo=vite)

## ✨ Features

- **3D Interactive Card** - Rotate, zoom, and flip the card with mouse/touch gestures
- **Responsive Design** - Automatically switches between portrait and landscape layouts
- **Theme Toggle** - Switch between light and dark themes with a single click
- **Smooth Animations** - Floating particles, orbiting lights, and gentle card hover effects
- **QR Code Integration** - Dynamic QR code linking to portfolio
- **Touch Support** - Full mobile support with pinch-to-zoom and swipe gestures
- **Modular Architecture** - Easy to customize with separate constants and theme files

## 🛠️ Tech Stack

- **React 18** - UI framework
- **Three.js** - 3D graphics rendering
- **Vite** - Build tool and dev server
- **Canvas API** - Dynamic texture generation

## 📁 Project Structure

```
├── .env.example      # Environment variables template
├── .env              # Your local environment variables (do not commit)
├── .gitignore        # Git ignore rules
├── src/
│   ├── constants.js      # All text content and personal information
│   ├── lightTheme.js     # Light theme color configuration
│   ├── darkTheme.js      # Dark theme color configuration
│   ├── BusinessCard.jsx  # Main component with 3D rendering
│   ├── analytics.js      # Google Analytics tracking (optional)
│   ├── main.jsx          # Application entry point
│   └── index.css         # Global styles
```

## 🚀 Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm or yarn

### Installation

1. **Clone or create a new Vite React project:**
   ```bash
   npm create vite@latest my-business-card -- --template react
   cd my-business-card
   ```

2. **Install dependencies:**
   ```bash
   npm install three @vercel/analytics
   ```
   
   Optional (for Google Analytics):
   ```bash
   npm install react-ga4
   ```

3. **Copy the source files:**
   
   Replace/add the following files in your `src/` directory:
   - `constants.js`
   - `lightTheme.js`
   - `darkTheme.js`
   - `BusinessCard.jsx`
   - `main.jsx`
   - `index.css`

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## 🎮 How to Use

| Action | Desktop | Mobile |
|--------|---------|--------|
| **Rotate** | Click and drag | Touch and drag |
| **Flip** | Click on card | Tap on card |
| **Zoom** | Scroll wheel | Pinch gesture |
| **Toggle Theme** | Click theme button | Tap theme button |

## 🎨 Customization

### Updating Personal Information

Edit `constants.js` to update your details:

```javascript
// Personal Information
export const NAME = 'YOUR NAME';
export const TITLE = 'YOUR TITLE';
export const EMAIL = 'your.email@example.com';
export const PHONE = '+1 (XXX) XXX-XXXX';

// Skills
export const LANGUAGES = ['JavaScript', 'Python', ...];
export const FRAMEWORKS = ['React', 'Node.js', ...];
```

### Customizing Themes

#### Light Theme (`lightTheme.js`)
```javascript
export const lightTheme = {
  bgPrimary: '#ffffff',        // Main background
  textPrimary: '#0f172a',      // Primary text color
  accentPrimary: '#1e3a5f',    // Primary accent (headers)
  accentSecondary: '#9d174d',  // Secondary accent (highlights)
  // ... more options
};
```

#### Dark Theme (`darkTheme.js`)
```javascript
export const darkTheme = {
  bgPrimary: '#0d1117',        // Main background
  textPrimary: '#ffffff',      // Primary text color
  accentPrimary: '#00d4ff',    // Primary accent (cyan)
  accentSecondary: '#ffb347',  // Secondary accent (orange)
  // ... more options
};
```

### Theme Properties Reference

| Property | Description |
|----------|-------------|
| `bgPrimary` | Main background color |
| `bgSecondary` | Secondary background for gradients |
| `textPrimary` | Main text color |
| `textMuted` | Subdued text color |
| `accentPrimary` | Primary accent color |
| `accentSecondary` | Secondary accent color |
| `accentTertiary` | Third accent color |
| `langBg/Border` | Language skill box colors |
| `frameworkBg/Border` | Framework skill box colors |
| `aiBg/Border` | AI skills box colors |
| `cardMetalness` | Three.js material metalness |
| `cardRoughness` | Three.js material roughness |

## 📱 Responsive Behavior

The card automatically adapts based on screen size:

- **Desktop (landscape)**: Horizontal card layout (1400x820 canvas)
- **Mobile (portrait)**: Vertical card layout (700x1100 canvas)
- **Breakpoint**: 768px width or when height > width

## 🔧 Configuration Options

### Adjusting Camera Distance

In `BusinessCard.jsx`, modify the `getCameraZ` function:

```javascript
const getCameraZ = () => isPortrait() ? 4.5 : 3.0;
```

### Changing Animation Speed

Adjust the time multiplier in the `animate` function:

```javascript
time += 0.016; // Increase for faster animations
```

### Modifying Particle Count

Update the particle array initialization:

```javascript
const [particles] = useState(() => 
  Array.from({ length: 30 }, ...) // Change 30 to desired count
);
```

## 📄 File Descriptions

| File | Purpose |
|------|---------|
| `.env.example` | Template for environment variables |
| `.env` | Your local environment variables (create from .env.example) |
| `.gitignore` | Prevents sensitive files from being committed |
| `constants.js` | All text strings, personal info, skills, and section titles |
| `lightTheme.js` | Light mode colors and Three.js material settings |
| `darkTheme.js` | Dark mode colors and Three.js material settings |
| `BusinessCard.jsx` | Main React component with Three.js scene setup |
| `analytics.js` | Google Analytics 4 tracking functions (optional) |
| `main.jsx` | React app entry point with Vercel Analytics |
| `index.css` | Base styles and resets |

## 🌐 Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## 📝 License

MIT License - Feel free to use and modify for your own projects.

---

## 📊 Analytics & Visitor Tracking

Track who's visiting your card and from where. See the detailed **[Analytics Setup Guide](./ANALYTICS.md)** for full instructions.

### Quick Setup: Vercel Analytics

```bash
npm install @vercel/analytics
```

Already configured in `main.jsx` - just deploy to Vercel and view analytics in your Vercel dashboard.

### Optional: Google Analytics 4

For more detailed tracking (demographics, company networks, custom events):

```bash
npm install react-ga4
```

Create a `.env` file in your project root:
```bash
VITE_GA_TRACKING_ID=G-XXXXXXXXXX
```

Get your tracking ID from [analytics.google.com](https://analytics.google.com) and replace `G-XXXXXXXXXX` with your actual ID.

> ⚠️ **Important**: Never commit your `.env` file to git. Add it to `.gitignore`.

For Vercel deployment, add the environment variable in:
**Vercel Dashboard → Your Project → Settings → Environment Variables**

### What You Can Track

- 👥 **Visitors** - Total views, unique visitors
- 🌍 **Location** - Countries, cities
- 🏢 **Companies** - Network providers (see which companies view your card)
- 📱 **Devices** - Desktop vs mobile, browsers
- 🔗 **Referrers** - How people found your card (LinkedIn, GitHub, etc.)
- 🖱️ **Interactions** - Card flips, theme toggles, time spent

---

## 🤝 Credits

- Three.js for 3D rendering
- QR Code API: [goqr.me](https://goqr.me/api/)
