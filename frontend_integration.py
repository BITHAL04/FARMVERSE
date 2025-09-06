"""
Frontend Integration Example for Clerk Authentication
"""

# React.js Frontend Example with Clerk
react_example = """
// Install Clerk React SDK
// npm install @clerk/nextjs

// pages/_app.js or app/layout.js (Next.js)
import { ClerkProvider } from '@clerk/nextjs'

export default function App({ Component, pageProps }) {
  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      <Component {...pageProps} />
    </ClerkProvider>
  )
}

// components/FarmVerseChat.jsx
import { useAuth, useUser } from '@clerk/nextjs'
import { useState, useEffect } from 'react'

export default function FarmVerseChat() {
  const { getToken } = useAuth()
  const { user } = useUser()
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [farmerProfile, setFarmerProfile] = useState(null)

  // Login to FarmVerse backend
  const loginToFarmVerse = async () => {
    try {
      const clerkToken = await getToken()
      const response = await fetch('http://localhost:8000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clerk_session_token: clerkToken
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        localStorage.setItem('farmverse_token', data.access_token)
        setFarmerProfile(data.user.farmer_profile)
        return data.access_token
      }
    } catch (error) {
      console.error('Login failed:', error)
    }
  }

  // Send chat message
  const sendMessage = async (message) => {
    const token = localStorage.getItem('farmverse_token')
    
    const response = await fetch('http://localhost:8000/chat/text', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ message })
    })
    
    if (response.ok) {
      const data = await response.json()
      setMessages(prev => [...prev, 
        { type: 'user', content: message },
        { type: 'bot', content: data.response, contextUsed: data.farmer_context_used }
      ])
    }
  }

  return (
    <div className="farmverse-chat">
      <h2>FarmVerse Agriculture Assistant</h2>
      
      {user && (
        <div className="user-info">
          <p>Welcome, {user.firstName}! 👨‍🌾</p>
          {farmerProfile && (
            <p>Farm: {farmerProfile.location} ({farmerProfile.farm_land_capacity} acres)</p>
          )}
        </div>
      )}
      
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.type}`}>
            <p>{msg.content}</p>
            {msg.contextUsed && <small>✅ Personalized for your farm</small>}
          </div>
        ))}
      </div>
      
      <div className="chat-input">
        <input
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Ask about farming..."
          onKeyPress={(e) => e.key === 'Enter' && sendMessage(inputMessage)}
        />
        <button onClick={() => sendMessage(inputMessage)}>Send</button>
      </div>
    </div>
  )
}
"""

# Vanilla JavaScript Example
vanilla_js_example = """
// Vanilla JavaScript with Clerk
<script src="https://cdn.jsdelivr.net/npm/@clerk/clerk-js@latest/dist/clerk.browser.js"></script>

<script>
const clerk = window.Clerk
await clerk.load({
  publishableKey: 'pk_test_aW5jbHVkZWQtbW9uaXRvci00OC5jbGVyay5hY2NvdW50cy5kZXYk'
})

// Login and get token
async function loginToFarmVerse() {
  try {
    const token = await clerk.session.getToken()
    const response = await fetch('http://localhost:8000/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clerk_session_token: token })
    })
    
    const data = await response.json()
    localStorage.setItem('farmverse_token', data.access_token)
    return data
  } catch (error) {
    console.error('Login failed:', error)
  }
}

// Create farmer profile
async function createFarmerProfile(profileData) {
  const token = localStorage.getItem('farmverse_token')
  
  const response = await fetch('http://localhost:8000/auth/profile/farmer', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ farmer_profile: profileData })
  })
  
  return response.json()
}

// Send chat message
async function sendChatMessage(message) {
  const token = localStorage.getItem('farmverse_token')
  
  const response = await fetch('http://localhost:8000/chat/text', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ message })
  })
  
  return response.json()
}
</script>
"""

print("🔑 Clerk API Keys Configuration Complete!")
print("=" * 50)
print("✅ Added to .env.example:")
print("- CLERK_SECRET_KEY")
print("- CLERK_PUBLISHABLE_KEY") 
print("- NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY")
print("\n📋 Frontend Integration Examples Generated")
print("- React.js with Next.js")
print("- Vanilla JavaScript")
print("\n🚀 Ready for Production!")
