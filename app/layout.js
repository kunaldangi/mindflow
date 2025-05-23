import { Inter } from 'next/font/google'; // Looks same as ChatGPT font
import './globals.css';

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
	title: 'MindFlow - AI Chatbot',
}

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body className={inter.className}>{children}</body>
		</html>
	)
}

