# AIHubChat

AIHubChat is a versatile AI chat assistant that serves as a central hub for interacting with various AI models from different providers, including OpenAI and Anthropic's Claude. Built with Next.js, TypeScript, and LangChain, this application offers a user-friendly interface for engaging with state-of-the-art language models.

![AIHubChat Screenshot](screenshot.png)

## Features

- Support for multiple AI providers (OpenAI and Claude)
- Easy switching between different AI models
- In-app management of API keys for different providers
- Persistent chat history
- Dark mode support
- File attachment capability (up to 10MB)
- Responsive design for desktop and mobile use

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/salacoste/AIHubChat.git
   ```

2. Navigate to the project directory:
   ```
   cd AIHubChat
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Run the development server:
   ```
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

1. Select an AI provider from the dropdown menu in the settings panel.
2. Enter your API key for the selected provider in the provided field.
   - Note: Your API keys are managed securely within the application and are not stored in any configuration files.
3. Choose a specific AI model from the available options.
4. Type your message in the chat input and press "Send" or hit Enter.
5. To attach a file, click on "Choose File" and select a file up to 10MB in size.

## Security Note

API keys are managed within the application interface and are stored locally in your browser. Always ensure you're using AIHubChat on a secure device and never share your API keys with others.

## Contributing

We welcome contributions to AIHubChat! Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature/your-feature-name`.
3. Make your changes and commit them: `git commit -m 'Add some feature'`.
4. Push to the branch: `git push origin feature/your-feature-name`.
5. Submit a pull request.

Please ensure your code adheres to the existing style and that all tests pass.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [LangChain](https://js.langchain.com/)
- [OpenAI](https://openai.com/)
- [Anthropic](https://www.anthropic.com/)

## Contact

If you have any questions or feedback, please open an issue on this repository or contact the maintainers directly.

---

Happy chatting with AI!