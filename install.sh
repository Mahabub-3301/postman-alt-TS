#!/bin/bash
#!/bin/bash

echo "🔧 Installing Postman Lite CLI..."

# Check for Node.js
if ! command -v node &> /dev/null
then
    echo "❌ Node.js not found. Please install Node.js first."
    exit 1
fi

# Clone if needed
if [ ! -d "postman-alt" ]; then
  git clone https://github.com/Mahabub-3301/postman-alt-TS.git
fi

cd postman-alt-TS

# Install dependencies
npm install

# Build executable
npm run build

# Move executable to /usr/local/bin
sudo cp dist/postman-alt /usr/local/bin/postman-alt
sudo chmod +x /usr/local/bin/postman-alt

echo "✅ Postman Lite installed. Run with:"
echo "   postman-lite <url>"


