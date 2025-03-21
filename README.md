### SlideBoost

SlideBoost is a micro SaaS app that revolutionizes how users create PowerPoint presentations. Unlike traditional tools, our platform allows users to seamlessly integrate and customize content from a variety of sources, including video, text, images, and audio, providing a dynamic and engaging presentation creation experience.

### Architecture & Design

The architecture and design of the SlideBoost application incorporate a robust and efficient tech stack to ensure optimal performance and scalability:

- **Frontend**: Built with React.js, ensuring a reactive and composable user interface architecture that is well-suited for dynamic and interactive web applications.
- **Backend**: Developed using TypeScript with Node.js and Express, providing a scalable and maintainable backend framework for handling business logic and API requests.
- **Cloud Storage**: Integrated with Backblaze B2 Cloud Storage for scalable, reliable, and cost-effective cloud storage solutions. This is used to store media files, ensuring efficient data management and access.
- **Database**: Utilizes PostgreSQL for a powerful, open-source relational database that supports complex queries, transactions, and data integrity, ensuring efficient and reliable storage for application data.
- **Cloudflare**: Utilizes Cloudflare as a proxy service to secure and optimize data retrieval from the encrypted cloud bucket (Backblaze). Cloudflare ensures the integrity, security, and fast delivery of content via its global Content Delivery Network (CDN), while also providing DDoS protection, caching, and rate-limiting.
- **Payment Processing**: Integrated with Stripe for secure, flexible transaction handling, subscription management, and payment failure handling. It supports multiple payment methods and currencies for a seamless user experience.

### Installation

To run the application locally, follow the instructions below:

- For the client, execute: ./c.bat
- For the server, execute: ./s.bat
