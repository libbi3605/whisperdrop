# **App Name**: WhisperDrop

## Core Features:

- Anonymous ID Generation: Generate a random, unique user ID upon first app launch with no personal information collected.
- End-to-End Encryption: Implement a client-side encryption module to encrypt all messages before sending and decrypt upon receipt. This will include encryption key management and secure exchange between users. Use a tool such as a hashing algorithm to achieve a secure implementation.
- Ephemeral Message Handling: Configure message expiration times on a per-chat basis. Messages self-delete after being read or after the configured time.
- Decentralized message deletion: Verify message deletion by employing peer-to-peer confirmation or implementing cryptographic proofs of deletion that provide irrefutable verification of data removal across the client application.
- Message Routing and Queueing: Messages pass through a processing server which then intelligently uses a routing/queueing system (e.g., Redis, RabbitMQ) to ensure proper message delivery and queue management to prevent data bottlenecks, which the server may monitor.

## Style Guidelines:

- Primary color: Dark teal (#008080) to convey security and trustworthiness.
- Background color: Very dark gray (#222222) to create a sense of anonymity and privacy with a dark theme.
- Accent color: Electric green (#7CFC00) for highlighting important elements such as encryption status, send buttons, and notification indicators.
- Font: 'Inter' (sans-serif) for clear and modern readability. Suitable for both headlines and body text.
- Use minimalist, monochromatic icons. Icons for message status (sent, received, read, deleted) are essential.
- A clean, focused layout with emphasis on message content. The design should ensure ease of use and quick navigation while avoiding visual distractions.
- Subtle animations for message delivery, encryption status, and deletion confirmation, offering smooth visual feedback.