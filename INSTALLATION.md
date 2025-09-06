# FarmVerse Agriculture Chatbot - Installation & Usage Guide

## Quick Start (Basic Version)

The project includes a simplified version that works without external API dependencies for immediate testing.

### 1. Setup Environment

```bash
# Windows PowerShell
cd d:\farmverse
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install fastapi uvicorn python-dotenv pydantic
```

### 2. Run Basic Version

```bash
python main_simple.py
```

Visit: http://localhost:8000/docs for API documentation

## Full Installation (Complete Features)

### Prerequisites

1. **Python 3.8+** - Download from [python.org](https://python.org)
2. **OpenAI API Key** - Get from [OpenAI Platform](https://platform.openai.com)
3. **Google Cloud Account** (for Speech & Translation)

### Installation Steps

1. **Clone and Setup**
   ```bash
   cd d:\farmverse
   python -m venv venv
   .\venv\Scripts\Activate.ps1
   pip install -r requirements.txt
   ```

2. **Configure Environment**
   ```bash
   copy .env.example .env
   ```
   
   Edit `.env` file with your API keys:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   GOOGLE_APPLICATION_CREDENTIALS=path_to_google_credentials.json
   GOOGLE_CLOUD_PROJECT_ID=your_project_id
   ```

3. **Run Application**
   ```bash
   uvicorn main:app --reload
   ```

## API Endpoints

### Basic Endpoints
- `GET /` - Welcome message
- `GET /health` - Health check
- `GET /docs` - Interactive API documentation
- `GET /languages` - Supported languages

### Chat Endpoints
- `POST /chat/text` - Text-based chat
- `POST /chat/voice` - Voice-based chat (full version)
- `POST /chat/image` - Image analysis chat (full version)

### Agriculture Information
- `GET /api/v1/agriculture/crops` - Crop information
- `GET /api/v1/agriculture/diseases` - Disease information
- `GET /api/v1/agriculture/faq` - Frequently asked questions
- `POST /api/v1/agriculture/advice` - Specific advice

## Example Usage

### Text Chat (English)
```json
POST /chat/text
{
  "message": "What is the best fertilizer for wheat?",
  "user_id": "farmer123",
  "language": "en"
}
```

### Text Chat (Hindi)
```json
POST /chat/text
{
  "message": "गेहूं के लिए कौन सा उर्वरक सबसे अच्छा है?",
  "user_id": "farmer123", 
  "language": "hi"
}
```

### Image Analysis (Full Version)
```bash
curl -X POST "http://localhost:8000/chat/image" \
  -F "image_file=@crop_image.jpg" \
  -F "message=Analyze this crop for diseases" \
  -F "user_id=farmer123"
```

### Voice Chat (Full Version)
```bash
curl -X POST "http://localhost:8000/chat/voice" \
  -F "audio_file=@voice_question.wav" \
  -F "user_id=farmer123"
```

## Features

### ✅ Implemented (Basic Version)
- FastAPI backend with async support
- Multilingual text chat (English/Hindi)
- Agriculture-specific responses
- Language detection
- REST API with documentation
- Health monitoring
- CORS support

### 🚧 Advanced Features (Full Version)
- OpenAI GPT integration for intelligent responses
- Voice input/output (Speech-to-Text/Text-to-Speech)
- Image analysis for crop diseases and pests
- Google Cloud Speech and Translation APIs
- Advanced agriculture knowledge base
- Chat history and user management
- Docker containerization

## Testing

### Manual Testing
1. Start the server: `python main_simple.py`
2. Visit: http://localhost:8000/docs
3. Test the `/chat/text` endpoint with sample messages

### Automated Testing
```bash
pip install pytest pytest-asyncio
pytest tests/ -v
```

### Example Test Messages

**English Questions:**
- "What is the best fertilizer for wheat?"
- "How to control pests in tomato plants?"
- "When should I harvest rice?"

**Hindi Questions:**
- "गेहूं के लिए कौन सा उर्वरक अच्छा है?"
- "टमाटर में कीट कैसे नियंत्रित करें?"
- "चावल की कटाई कब करनी चाहिए?"

## Troubleshooting

### Common Issues

1. **Import Errors**
   - Ensure virtual environment is activated
   - Check all dependencies are installed

2. **API Key Issues**
   - Verify `.env` file configuration
   - Check API key validity

3. **Voice/Image Not Working**
   - Install full requirements: `pip install -r requirements.txt`
   - Configure Google Cloud credentials

### Development Mode

For development with auto-reload:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## Deployment

### Using Docker
```bash
docker build -t farmverse-api .
docker run -p 8000:8000 farmverse-api
```

### Using Docker Compose
```bash
docker-compose up -d
```

## Architecture

```
FarmVerse/
├── app/
│   ├── api/           # API routes
│   ├── core/          # Configuration & exceptions
│   ├── models/        # Pydantic models
│   ├── services/      # Business logic
│   ├── training/      # Agriculture knowledge base
│   └── utils/         # Helper functions
├── static/            # Static files (audio/images)
├── tests/             # Test suite
├── examples/          # Usage examples
└── main.py           # Application entry point
```

## Contributing

1. Fork the repository
2. Create feature branch
3. Make changes with tests
4. Submit pull request

## License

This project is licensed under the MIT License.
