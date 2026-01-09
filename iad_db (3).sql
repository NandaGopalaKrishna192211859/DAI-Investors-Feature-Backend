-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 03, 2026 at 10:28 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `iad_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `category_name` varchar(100) NOT NULL,
  `q7` text DEFAULT NULL,
  `q8` text DEFAULT NULL,
  `q9` text DEFAULT NULL,
  `q10` text DEFAULT NULL,
  `q11` text DEFAULT NULL,
  `q12` text DEFAULT NULL,
  `q13` text DEFAULT NULL,
  `q14` text DEFAULT NULL,
  `q15` text DEFAULT NULL,
  `q16` text DEFAULT NULL,
  `q17` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `category_name`, `q7`, `q8`, `q9`, `q10`, `q11`, `q12`, `q13`, `q14`, `q15`, `q16`, `q17`) VALUES
(1, 'Commerce & Retail', 'What type of products or services will people browse or buy?', 'How should users search or find what they need?', 'How should users compare different items?', 'What steps should a user follow to place an order?', 'How should users track their orders after buying?', 'Do you want users to save favourite items or wishlists?', 'How should the seller or shop owner manage their items?', 'What kind of offers, discounts, or deals do you want to include?', 'How should returns or exchanges be handled?', 'How do you want users to communicate with sellers?', 'What actions should the app take if an item goes out of stock?'),
(2, 'Food & Hospitality', 'What type of food or services will users explore?', 'How should users place an order or booking?', 'Do users need options like takeaway, delivery, or dine-in?', 'How should restaurants or providers show their menu or services?', 'Do you want users to customise their food or request special options?', 'How should users track the status of their order or booking?', 'Do you want ratings or reviews for food or service?', 'How should offers or combos be shown to users?', 'How can customers contact the restaurant or service provider?', 'How should users repeat a past order quickly?', 'What should happen if a food item or service becomes unavailable?'),
(3, 'Health & Wellness', 'What type of health or wellness service does your idea offer?', 'How should users describe their goals or health needs?', 'Should users book appointments, sessions, or classes?', 'Do you want progress tracking for health activities?', 'Should users receive reminders, tips, or guidance?', 'How should professionals or trainers share their details?', 'Do you want chat or communication between users and experts?', 'Should users log daily habits or routines?', 'How should users get alerts for important updates?', 'What actions should users take during emergencies?', 'How should reports, plans, or recommendations be shown to users?'),
(4, 'Social & Communication', 'What kind of people or groups should users connect with?', 'How should users share posts, ideas, or messages?', 'Do you want private messaging, group chats, or both?', 'How should users find and follow others?', 'Do you want users to react, comment, or reply to content?', 'How should the app handle blocking or reporting?', 'How should users control who can see their content?', 'What type of notifications should users get?', 'Do you want events, communities, or groups?', 'How should users manage their profile details?', 'What actions should the app take to keep conversations safe and healthy?'),
(5, 'Finance & Banking (FinTech)', 'What money-related tasks should the user be able to do?', 'How should users check their balances or records?', 'Should users send or receive money?', 'Do you want goal tracking or savings plans?', 'Should users get alerts for important activities?', 'How should users view their past transactions?', 'Do you want spending limits or budgets?', 'Should users see charts or summaries of their expenses?', 'Do you want reminders for bills or payments?', 'What steps should users follow for identity or detail verification?', 'How should users report issues or suspicious actions?'),
(6, 'Transportation & Mobility', 'What type of travel or movement does your app support?', 'How should users search for rides, vehicles, or routes?', 'Do you want booking for cars, bikes, taxis, or something else?', 'How should users see estimated arrival or travel time?', 'Do you want real-time tracking of vehicles?', 'How should users cancel or change a booking?', 'Do you want ratings for drivers or vehicles?', 'How should drivers or providers manage their availability?', 'What information should users see before confirming a ride?', 'How should users contact the driver or support?', 'What should happen if no vehicle is available?'),
(7, 'Education & Learning (EdTech)', 'What type of learning or subjects does your app support?', 'How should users join classes, lessons, or courses?', 'Do you want quizzes, tasks, or practice sessions?', 'How should progress or scores be shown to learners?', 'Should teachers upload lessons, notes, or videos?', 'How should students ask doubts or get feedback?', 'Do you want reminders for classes or deadlines?', 'How should new content be discovered by learners?', 'Do you want certifications, badges, or rewards?', 'How should parents or guardians view a learner’s progress?', 'What should happen when a learner completes a course?'),
(8, 'Enterprise & Productivity (SaaS)', 'What type of work or tasks will your app help people manage?', 'How should users track their daily activities?', 'Do you want to allow team collaboration?', 'How should users share files, notes, or updates?', 'Do you want reminders, schedules, or task deadlines?', 'How should managers or leaders oversee tasks?', 'Do you want charts or summaries of progress?', 'Should users create goals or milestones?', 'How should users communicate inside the app?', 'How should users organise their work into sections or projects?', 'What actions should the app take when a task becomes overdue?'),
(9, 'Other', 'What is the main purpose of your idea?', 'Who will use the app and what do they expect?', 'What main actions should users be able to perform?', 'What steps should users follow to complete their goals?', 'What information should users see when they start?', 'What problems does your app solve in daily life?', 'Do you want users to save their progress or history?', 'Do you want any type of reminders or alerts?', 'How should users communicate if they need help?', 'How should the app respond when something goes wrong?', 'What unique or special behaviour do you want your app to have?');

-- --------------------------------------------------------

--
-- Table structure for table `chats`
--

CREATE TABLE `chats` (
  `chat_id` int(11) NOT NULL,
  `request_id` int(11) NOT NULL,
  `requestby_uid` int(11) NOT NULL,
  `responseby_uid` int(11) NOT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `chats`
--

INSERT INTO `chats` (`chat_id`, `request_id`, `requestby_uid`, `responseby_uid`, `is_active`, `created_at`) VALUES
(3, 158, 1, 4, 1, '2026-01-03 07:12:24'),
(4, 164, 4, 1, 1, '2026-01-03 07:44:35'),
(5, 159, 1, 4, 1, '2026-01-03 09:14:23');

-- --------------------------------------------------------

--
-- Table structure for table `chat_messages`
--

CREATE TABLE `chat_messages` (
  `message_id` int(11) NOT NULL,
  `chat_id` int(11) NOT NULL,
  `sender_uid` int(11) NOT NULL,
  `message` text NOT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `chat_messages`
--

INSERT INTO `chat_messages` (`message_id`, `chat_id`, `sender_uid`, `message`, `is_read`, `created_at`) VALUES
(26, 3, 1, 'hi', 0, '2026-01-03 07:12:30'),
(27, 3, 4, 'hi', 0, '2026-01-03 07:12:38'),
(28, 4, 4, 'hi', 0, '2026-01-03 07:44:39'),
(29, 4, 1, 'hi', 0, '2026-01-03 07:44:54'),
(30, 3, 4, 'mango', 0, '2026-01-03 07:55:13'),
(31, 4, 4, 'apple', 0, '2026-01-03 07:55:27'),
(32, 5, 1, 'hi', 0, '2026-01-03 09:14:27');

-- --------------------------------------------------------

--
-- Table structure for table `password_resets`
--

CREATE TABLE `password_resets` (
  `id` int(11) NOT NULL,
  `email` varchar(100) NOT NULL,
  `otp` varchar(10) NOT NULL,
  `expires_at` datetime NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `password_resets`
--

INSERT INTO `password_resets` (`id`, `email`, `otp`, `expires_at`, `created_at`) VALUES
(1, 'ngk@gmail.com', '425431', '2025-12-20 11:00:34', '2025-12-20 05:25:34');

-- --------------------------------------------------------

--
-- Table structure for table `projects`
--

CREATE TABLE `projects` (
  `pid` int(11) NOT NULL,
  `uid` int(11) NOT NULL,
  `q1` text DEFAULT NULL,
  `q2` text DEFAULT NULL,
  `q3` text DEFAULT NULL,
  `q4` text DEFAULT NULL,
  `q5` text DEFAULT NULL,
  `category_id` varchar(100) DEFAULT NULL,
  `q7` text DEFAULT NULL,
  `q8` text DEFAULT NULL,
  `q9` text DEFAULT NULL,
  `q10` text DEFAULT NULL,
  `q11` text DEFAULT NULL,
  `q12` text DEFAULT NULL,
  `q13` text DEFAULT NULL,
  `q14` text DEFAULT NULL,
  `q15` text DEFAULT NULL,
  `q16` text DEFAULT NULL,
  `q17` text DEFAULT NULL,
  `q18` text DEFAULT NULL,
  `full_input` longtext DEFAULT NULL,
  `uml_path` varchar(255) DEFAULT NULL,
  `image_path` varchar(255) DEFAULT NULL,
  `explanation` longtext DEFAULT NULL,
  `status` tinyint(4) DEFAULT 0,
  `modified_input` longtext DEFAULT NULL,
  `modification_version` varchar(20) DEFAULT '1.0.0',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `project_title` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `projects`
--

INSERT INTO `projects` (`pid`, `uid`, `q1`, `q2`, `q3`, `q4`, `q5`, `category_id`, `q7`, `q8`, `q9`, `q10`, `q11`, `q12`, `q13`, `q14`, `q15`, `q16`, `q17`, `q18`, `full_input`, `uml_path`, `image_path`, `explanation`, `status`, `modified_input`, `modification_version`, `created_at`, `updated_at`, `project_title`) VALUES
(31, 1, 'A smart bike rental app for city commuters', 'Daily commuters, tourists, bike owners, city admin', 'Helps people quickly find, unlock, and rent bikes across the city', 'Search bikes, scan QR to unlock, ride tracking, digital payments', 'The service should feel fast, reliable, and easy to use', 'Transportation & Mobility', 'Users choose bikes based on nearby availability.', 'Search filters include distance, price per hour, and bike type.', 'Comparison is done using ratings, bike condition, and speed limit.', 'Steps: locate bike, scan QR, unlock, ride, end trip, auto payment.', 'Users track ride time, cost, and distance live.', 'Users can save favourite bike stations.', 'Bike owners can list their bikes and set rental availability.', 'We provide weekend offers and free first ride.', 'Refunds given if bike has mechanical issues.', 'Users can chat with support or report bike damage.', 'If a bike is unavailable, show nearest alternative stations.', 'Add push notifications for ride end alerts, maintenance alerts, and fast re-booking.', '**Modified Smart Bike Rental App Low-Level Design**\n\n**Modules:**\n\n1. **User Module**\n   - Handles user registration, login, and authentication\n   - Provides user profile management and settings\n\n2. **Bike Module**\n   - Manages bike listings, availability, and rental history\n   - Enables bike owners to list, edit, or remove bike listings\n\n3. **Ride Module**\n   - Handles ride tracking, status, and navigation\n   - Offers live tracking and alerts for users and bike owners\n\n4. **Payment Module**\n   - Manages online digital payments \n   - Offers auto payment options for users\n\n5. **Delivery Module**\n   - Enables Google Maps integration for delivery personnel for efficient route planning\n   - Manages delivery assignment and tracking for employees\n\n6. **Notification Module**\n   - Sends notifications to users and bike owners for trips and updates\n   - Offers customizable notification preferences and settings\n\n7. **Administration Module**\n   - Manages system settings and configurations\n   - Provides analytics and insights for bike rental trends and user behavior\n\n**Features:**\n\n1. **User-Friendly Search Engine**\n   - Offers filters for distance and bike type\n   - Provides real-time availability and bike information\n\n2. **Live Ride Tracking and Navigation**\n   - Offers live updates and navigation for users and bike owners\n   - Provides accurate location tracking and alerts\n\n3. **Digital Payments**\n   - Offers auto payment options for users\n   - Provides payment history and analytics\n\n4. **Delivery Services**\n   - Employees are assigned to deliver bikes to users using Google Maps\n   - Customers can track their delivery progress\n\n5. **Bike Owner Management**\n   - Enables bike owners to list, edit, or remove bike listings\n   - Provides bike rental history and analytics for bike owners\n\n**Data Flow:**\n\n1. User Registration and Login\n   - User data stored in User Module database\n   - User authentication and login handled by User Module\n\n2. Bike Listing and Management\n   - Bike information stored in Bike Module database\n   - Bike owners can list, edit, or remove bike listings through Bike Module\n\n3. Ride Tracking and Payment\n   - Ride data stored in Ride Module database\n   - Payment transactions handled by Payment Module\n\nUML Diagram:\n```markdown\n+---------------+\n|    User    |\n+---------------+\n|  Registration  |\n|  Login        |\n|  Profile      |\n|  Settings     |\n+---------------+\n\n+---------------+\n|    Bike    |\n+---------------+\n|  Listing     |\n|  Availability|\n|  Rental History|\n+---------------+\n\n+---------------+\n|    Ride    |\n+---------------+\n|  Tracking    |\n|  Status     |\n|  Navigation  |\n+---------------+\n\n+---------------+\n|   Delivery  |\n+---------------+\n|  Employee    |\n|  Assignment  |\n|  Tracking    |\n|  Google Maps  |\n+---------------+\n\n+---------------+\n|  Payment     |\n+---------------+\n|  Online Digital  |\n|  Payments     |\n+---------------+\n\n+---------------+\n| Notificaton |\n+---------------+\n|  Push         |\n|  Email    |\n+---------------+\n\n+---------------+\n| Administration|\n+---------------+\n|  Settings     |\n|  Configurations|\n|  Insights    |\n+---------------+\n```', 'C:\\Users\\irfan\\Downloads\\Nanda PDD\\Backend\\DAI-Investors Feature Backend\\src\\storage\\uml\\31_1766335471023.uml', 'src/storage/diagrams/31_1766335471023.png', '**Modified Smart Bike Rental App Low-Level Design**\n\n**Modules:**\n\n1. **User Module**\n   - Handles user registration, login, and authentication\n   - Provides user profile management and settings\n\n2. **Bike Module**\n   - Manages bike listings, availability, and rental history\n   - Enables bike owners to list, edit, or remove bike listings\n\n3. **Ride Module**\n   - Handles ride tracking, status, and navigation\n   - Offers live tracking and alerts for users and bike owners\n\n4. **Payment Module**\n   - Manages online digital payments \n   - Offers auto payment options for users\n\n5. **Delivery Module**\n   - Enables Google Maps integration for delivery personnel for efficient route planning\n   - Manages delivery assignment and tracking for employees\n\n6. **Notification Module**\n   - Sends notifications to users and bike owners for trips and updates\n   - Offers customizable notification preferences and settings\n\n7. **Administration Module**\n   - Manages system settings and configurations\n   - Provides analytics and insights for bike rental trends and user behavior\n\n**Features:**\n\n1. **User-Friendly Search Engine**\n   - Offers filters for distance and bike type\n   - Provides real-time availability and bike information\n\n2. **Live Ride Tracking and Navigation**\n   - Offers live updates and navigation for users and bike owners\n   - Provides accurate location tracking and alerts\n\n3. **Digital Payments**\n   - Offers auto payment options for users\n   - Provides payment history and analytics\n\n4. **Delivery Services**\n   - Employees are assigned to deliver bikes to users using Google Maps\n   - Customers can track their delivery progress\n\n5. **Bike Owner Management**\n   - Enables bike owners to list, edit, or remove bike listings\n   - Provides bike rental history and analytics for bike owners\n\n**Data Flow:**\n\n1. User Registration and Login\n   - User data stored in User Module database\n   - User authentication and login handled by User Module\n\n2. Bike Listing and Management\n   - Bike information stored in Bike Module database\n   - Bike owners can list, edit, or remove bike listings through Bike Module\n\n3. Ride Tracking and Payment\n   - Ride data stored in Ride Module database\n   - Payment transactions handled by Payment Module', 1, 'Google map integration for people', '1.0.3', '2025-12-20 17:01:32', '2025-12-21 16:44:34', 'Grip'),
(38, 1, '', '', '', '', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, '1.0.0', '2025-12-24 10:10:34', '2025-12-24 10:10:37', 'draft1'),
(39, 1, '', '', '', '', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, '1.0.0', '2025-12-25 07:20:45', '2025-12-25 07:20:47', 'draft2'),
(40, 1, '', '', '', '', '', 'Other', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, '1.0.0', '2025-12-25 07:20:52', '2025-12-25 07:21:18', 'draft3'),
(41, 1, '', '', '', '', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, '1.0.0', '2026-01-03 04:46:48', '2026-01-03 04:46:49', 'draft4');

-- --------------------------------------------------------

--
-- Table structure for table `project_requests`
--

CREATE TABLE `project_requests` (
  `id` int(11) NOT NULL,
  `pid` int(11) NOT NULL,
  `requestby_uid` int(11) NOT NULL,
  `responseby_uid` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `category` varchar(100) NOT NULL,
  `package` longtext NOT NULL,
  `is_hub` tinyint(1) NOT NULL DEFAULT 0,
  `dev_status` enum('ongoing','completed') NOT NULL DEFAULT 'ongoing',
  `response_status` enum('pending','accepted','rejected','invested') DEFAULT 'pending',
  `chat_access` tinyint(1) DEFAULT 0,
  `is_invested` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `project_requests`
--

INSERT INTO `project_requests` (`id`, `pid`, `requestby_uid`, `responseby_uid`, `title`, `category`, `package`, `is_hub`, `dev_status`, `response_status`, `chat_access`, `is_invested`, `created_at`) VALUES
(158, 31, 1, 4, 'Grip', 'Transportation & Mobility', '{\"project\":{\"pid\":31,\"title\":\"Grip\",\"category\":\"Transportation & Mobility\",\"version\":\"1.0.3\"},\"founder\":{\"uid\":1,\"name\":\"Nanda\",\"email\":\"nanda345@gmail.com\",\"phone\":\"6281806036\"},\"contents\":{\"summary\":\"**Modified Smart Bike Rental App Low-Level Design**\\n\\n**Modules:**\\n\\n1. **User Module**\\n   - Handles user registration, login, and authentication\\n   - Provides user profile management and settings\\n\\n2. **Bike Module**\\n   - Manages bike listings, availability, and rental history\\n   - Enables bike owners to list, edit, or remove bike listings\\n\\n3. **Ride Module**\\n   - Handles ride tracking, status, and navigation\\n   - Offers live tracking and alerts for users and bike owners\\n\\n4. **Payment Module**\\n   - Manages online digital payments \\n   - Offers auto payment options for users\\n\\n5. **Delivery Module**\\n   - Enables Google Maps integration for delivery personnel for efficient route planning\\n   - Manages delivery assignment and tracking for employees\\n\\n6. **Notification Module**\\n   - Sends notifications to users and bike owners for trips and updates\\n   - Offers customizable notification preferences and settings\\n\\n7. **Administration Module**\\n   - Manages system settings and configurations\\n   - Provides analytics and insights for bike rental trends and user behavior\\n\\n**Features:**\\n\\n1. **User-Friendly Search Engine**\\n   - Offers filters for distance and bike type\\n   - Provides real-time availability and bike information\\n\\n2. **Live Ride Tracking and Navigation**\\n   - Offers live updates and navigation for users and bike owners\\n   - Provides accurate location tracking and alerts\\n\\n3. **Digital Payments**\\n   - Offers auto payment options for users\\n   - Provides payment history and analytics\\n\\n4. **Delivery Services**\\n   - Employees are assigned to deliver bikes to users using Google Maps\\n   - Customers can track their delivery progress\\n\\n5. **Bike Owner Management**\\n   - Enables bike owners to list, edit, or remove bike listings\\n   - Provides bike rental history and analytics for bike owners\\n\\n**Data Flow:**\\n\\n1. User Registration and Login\\n   - User data stored in User Module database\\n   - User authentication and login handled by User Module\\n\\n2. Bike Listing and Management\\n   - Bike information stored in Bike Module database\\n   - Bike owners can list, edit, or remove bike listings through Bike Module\\n\\n3. Ride Tracking and Payment\\n   - Ride data stored in Ride Module database\\n   - Payment transactions handled by Payment Module\",\"lld\":\"**Modified Smart Bike Rental App Low-Level Design**\\n\\n**Modules:**\\n\\n1. **User Module**\\n   - Handles user registration, login, and authentication\\n   - Provides user profile management and settings\\n\\n2. **Bike Module**\\n   - Manages bike listings, availability, and rental history\\n   - Enables bike owners to list, edit, or remove bike listings\\n\\n3. **Ride Module**\\n   - Handles ride tracking, status, and navigation\\n   - Offers live tracking and alerts for users and bike owners\\n\\n4. **Payment Module**\\n   - Manages online digital payments \\n   - Offers auto payment options for users\\n\\n5. **Delivery Module**\\n   - Enables Google Maps integration for delivery personnel for efficient route planning\\n   - Manages delivery assignment and tracking for employees\\n\\n6. **Notification Module**\\n   - Sends notifications to users and bike owners for trips and updates\\n   - Offers customizable notification preferences and settings\\n\\n7. **Administration Module**\\n   - Manages system settings and configurations\\n   - Provides analytics and insights for bike rental trends and user behavior\\n\\n**Features:**\\n\\n1. **User-Friendly Search Engine**\\n   - Offers filters for distance and bike type\\n   - Provides real-time availability and bike information\\n\\n2. **Live Ride Tracking and Navigation**\\n   - Offers live updates and navigation for users and bike owners\\n   - Provides accurate location tracking and alerts\\n\\n3. **Digital Payments**\\n   - Offers auto payment options for users\\n   - Provides payment history and analytics\\n\\n4. **Delivery Services**\\n   - Employees are assigned to deliver bikes to users using Google Maps\\n   - Customers can track their delivery progress\\n\\n5. **Bike Owner Management**\\n   - Enables bike owners to list, edit, or remove bike listings\\n   - Provides bike rental history and analytics for bike owners\\n\\n**Data Flow:**\\n\\n1. User Registration and Login\\n   - User data stored in User Module database\\n   - User authentication and login handled by User Module\\n\\n2. Bike Listing and Management\\n   - Bike information stored in Bike Module database\\n   - Bike owners can list, edit, or remove bike listings through Bike Module\\n\\n3. Ride Tracking and Payment\\n   - Ride data stored in Ride Module database\\n   - Payment transactions handled by Payment Module\\n\\nUML Diagram:\\n```markdown\\n+---------------+\\n|    User    |\\n+---------------+\\n|  Registration  |\\n|  Login        |\\n|  Profile      |\\n|  Settings     |\\n+---------------+\\n\\n+---------------+\\n|    Bike    |\\n+---------------+\\n|  Listing     |\\n|  Availability|\\n|  Rental History|\\n+---------------+\\n\\n+---------------+\\n|    Ride    |\\n+---------------+\\n|  Tracking    |\\n|  Status     |\\n|  Navigation  |\\n+---------------+\\n\\n+---------------+\\n|   Delivery  |\\n+---------------+\\n|  Employee    |\\n|  Assignment  |\\n|  Tracking    |\\n|  Google Maps  |\\n+---------------+\\n\\n+---------------+\\n|  Payment     |\\n+---------------+\\n|  Online Digital  |\\n|  Payments     |\\n+---------------+\\n\\n+---------------+\\n| Notificaton |\\n+---------------+\\n|  Push         |\\n|  Email    |\\n+---------------+\\n\\n+---------------+\\n| Administration|\\n+---------------+\\n|  Settings     |\\n|  Configurations|\\n|  Insights    |\\n+---------------+\\n```\",\"image_path\":\"src/storage/diagrams/31_1766335471023.png\",\"uml_path\":\"C:\\\\Users\\\\irfan\\\\Downloads\\\\Nanda PDD\\\\Backend\\\\DAI-Investors Feature Backend\\\\src\\\\storage\\\\uml\\\\31_1766335471023.uml\"},\"business_advantage\":\"\",\"sent_at\":\"2026-01-03T05:27:04.609Z\"}', 0, 'ongoing', 'accepted', 1, 0, '2026-01-03 05:27:04'),
(159, 31, 1, 4, 'Grip', 'Transportation & Mobility', '{\"project\":{\"pid\":31,\"title\":\"Grip\",\"category\":\"Transportation & Mobility\",\"version\":\"1.0.3\"},\"founder\":{\"uid\":1,\"name\":\"Nanda\",\"email\":\"nanda345@gmail.com\",\"phone\":\"6281806036\"},\"contents\":{\"summary\":\"**Modified Smart Bike Rental App Low-Level Design**\\n\\n**Modules:**\\n\\n1. **User Module**\\n   - Handles user registration, login, and authentication\\n   - Provides user profile management and settings\\n\\n2. **Bike Module**\\n   - Manages bike listings, availability, and rental history\\n   - Enables bike owners to list, edit, or remove bike listings\\n\\n3. **Ride Module**\\n   - Handles ride tracking, status, and navigation\\n   - Offers live tracking and alerts for users and bike owners\\n\\n4. **Payment Module**\\n   - Manages online digital payments \\n   - Offers auto payment options for users\\n\\n5. **Delivery Module**\\n   - Enables Google Maps integration for delivery personnel for efficient route planning\\n   - Manages delivery assignment and tracking for employees\\n\\n6. **Notification Module**\\n   - Sends notifications to users and bike owners for trips and updates\\n   - Offers customizable notification preferences and settings\\n\\n7. **Administration Module**\\n   - Manages system settings and configurations\\n   - Provides analytics and insights for bike rental trends and user behavior\\n\\n**Features:**\\n\\n1. **User-Friendly Search Engine**\\n   - Offers filters for distance and bike type\\n   - Provides real-time availability and bike information\\n\\n2. **Live Ride Tracking and Navigation**\\n   - Offers live updates and navigation for users and bike owners\\n   - Provides accurate location tracking and alerts\\n\\n3. **Digital Payments**\\n   - Offers auto payment options for users\\n   - Provides payment history and analytics\\n\\n4. **Delivery Services**\\n   - Employees are assigned to deliver bikes to users using Google Maps\\n   - Customers can track their delivery progress\\n\\n5. **Bike Owner Management**\\n   - Enables bike owners to list, edit, or remove bike listings\\n   - Provides bike rental history and analytics for bike owners\\n\\n**Data Flow:**\\n\\n1. User Registration and Login\\n   - User data stored in User Module database\\n   - User authentication and login handled by User Module\\n\\n2. Bike Listing and Management\\n   - Bike information stored in Bike Module database\\n   - Bike owners can list, edit, or remove bike listings through Bike Module\\n\\n3. Ride Tracking and Payment\\n   - Ride data stored in Ride Module database\\n   - Payment transactions handled by Payment Module\",\"lld\":\"**Modified Smart Bike Rental App Low-Level Design**\\n\\n**Modules:**\\n\\n1. **User Module**\\n   - Handles user registration, login, and authentication\\n   - Provides user profile management and settings\\n\\n2. **Bike Module**\\n   - Manages bike listings, availability, and rental history\\n   - Enables bike owners to list, edit, or remove bike listings\\n\\n3. **Ride Module**\\n   - Handles ride tracking, status, and navigation\\n   - Offers live tracking and alerts for users and bike owners\\n\\n4. **Payment Module**\\n   - Manages online digital payments \\n   - Offers auto payment options for users\\n\\n5. **Delivery Module**\\n   - Enables Google Maps integration for delivery personnel for efficient route planning\\n   - Manages delivery assignment and tracking for employees\\n\\n6. **Notification Module**\\n   - Sends notifications to users and bike owners for trips and updates\\n   - Offers customizable notification preferences and settings\\n\\n7. **Administration Module**\\n   - Manages system settings and configurations\\n   - Provides analytics and insights for bike rental trends and user behavior\\n\\n**Features:**\\n\\n1. **User-Friendly Search Engine**\\n   - Offers filters for distance and bike type\\n   - Provides real-time availability and bike information\\n\\n2. **Live Ride Tracking and Navigation**\\n   - Offers live updates and navigation for users and bike owners\\n   - Provides accurate location tracking and alerts\\n\\n3. **Digital Payments**\\n   - Offers auto payment options for users\\n   - Provides payment history and analytics\\n\\n4. **Delivery Services**\\n   - Employees are assigned to deliver bikes to users using Google Maps\\n   - Customers can track their delivery progress\\n\\n5. **Bike Owner Management**\\n   - Enables bike owners to list, edit, or remove bike listings\\n   - Provides bike rental history and analytics for bike owners\\n\\n**Data Flow:**\\n\\n1. User Registration and Login\\n   - User data stored in User Module database\\n   - User authentication and login handled by User Module\\n\\n2. Bike Listing and Management\\n   - Bike information stored in Bike Module database\\n   - Bike owners can list, edit, or remove bike listings through Bike Module\\n\\n3. Ride Tracking and Payment\\n   - Ride data stored in Ride Module database\\n   - Payment transactions handled by Payment Module\\n\\nUML Diagram:\\n```markdown\\n+---------------+\\n|    User    |\\n+---------------+\\n|  Registration  |\\n|  Login        |\\n|  Profile      |\\n|  Settings     |\\n+---------------+\\n\\n+---------------+\\n|    Bike    |\\n+---------------+\\n|  Listing     |\\n|  Availability|\\n|  Rental History|\\n+---------------+\\n\\n+---------------+\\n|    Ride    |\\n+---------------+\\n|  Tracking    |\\n|  Status     |\\n|  Navigation  |\\n+---------------+\\n\\n+---------------+\\n|   Delivery  |\\n+---------------+\\n|  Employee    |\\n|  Assignment  |\\n|  Tracking    |\\n|  Google Maps  |\\n+---------------+\\n\\n+---------------+\\n|  Payment     |\\n+---------------+\\n|  Online Digital  |\\n|  Payments     |\\n+---------------+\\n\\n+---------------+\\n| Notificaton |\\n+---------------+\\n|  Push         |\\n|  Email    |\\n+---------------+\\n\\n+---------------+\\n| Administration|\\n+---------------+\\n|  Settings     |\\n|  Configurations|\\n|  Insights    |\\n+---------------+\\n```\",\"image_path\":\"src/storage/diagrams/31_1766335471023.png\",\"uml_path\":\"C:\\\\Users\\\\irfan\\\\Downloads\\\\Nanda PDD\\\\Backend\\\\DAI-Investors Feature Backend\\\\src\\\\storage\\\\uml\\\\31_1766335471023.uml\"},\"business_advantage\":\"\",\"sent_at\":\"2026-01-03T05:28:16.923Z\"}', 0, 'ongoing', 'accepted', 1, 0, '2026-01-03 05:28:16'),
(160, 31, 1, 2, 'Grip', 'Transportation & Mobility', '{\"project\":{\"pid\":31,\"title\":\"Grip\",\"category\":\"Transportation & Mobility\",\"version\":\"1.0.3\"},\"founder\":{\"uid\":1,\"name\":\"Nanda\",\"email\":\"nanda345@gmail.com\",\"phone\":\"6281806036\"},\"contents\":{\"summary\":\"**Modified Smart Bike Rental App Low-Level Design**\\n\\n**Modules:**\\n\\n1. **User Module**\\n   - Handles user registration, login, and authentication\\n   - Provides user profile management and settings\\n\\n2. **Bike Module**\\n   - Manages bike listings, availability, and rental history\\n   - Enables bike owners to list, edit, or remove bike listings\\n\\n3. **Ride Module**\\n   - Handles ride tracking, status, and navigation\\n   - Offers live tracking and alerts for users and bike owners\\n\\n4. **Payment Module**\\n   - Manages online digital payments \\n   - Offers auto payment options for users\\n\\n5. **Delivery Module**\\n   - Enables Google Maps integration for delivery personnel for efficient route planning\\n   - Manages delivery assignment and tracking for employees\\n\\n6. **Notification Module**\\n   - Sends notifications to users and bike owners for trips and updates\\n   - Offers customizable notification preferences and settings\\n\\n7. **Administration Module**\\n   - Manages system settings and configurations\\n   - Provides analytics and insights for bike rental trends and user behavior\\n\\n**Features:**\\n\\n1. **User-Friendly Search Engine**\\n   - Offers filters for distance and bike type\\n   - Provides real-time availability and bike information\\n\\n2. **Live Ride Tracking and Navigation**\\n   - Offers live updates and navigation for users and bike owners\\n   - Provides accurate location tracking and alerts\\n\\n3. **Digital Payments**\\n   - Offers auto payment options for users\\n   - Provides payment history and analytics\\n\\n4. **Delivery Services**\\n   - Employees are assigned to deliver bikes to users using Google Maps\\n   - Customers can track their delivery progress\\n\\n5. **Bike Owner Management**\\n   - Enables bike owners to list, edit, or remove bike listings\\n   - Provides bike rental history and analytics for bike owners\\n\\n**Data Flow:**\\n\\n1. User Registration and Login\\n   - User data stored in User Module database\\n   - User authentication and login handled by User Module\\n\\n2. Bike Listing and Management\\n   - Bike information stored in Bike Module database\\n   - Bike owners can list, edit, or remove bike listings through Bike Module\\n\\n3. Ride Tracking and Payment\\n   - Ride data stored in Ride Module database\\n   - Payment transactions handled by Payment Module\",\"lld\":\"**Modified Smart Bike Rental App Low-Level Design**\\n\\n**Modules:**\\n\\n1. **User Module**\\n   - Handles user registration, login, and authentication\\n   - Provides user profile management and settings\\n\\n2. **Bike Module**\\n   - Manages bike listings, availability, and rental history\\n   - Enables bike owners to list, edit, or remove bike listings\\n\\n3. **Ride Module**\\n   - Handles ride tracking, status, and navigation\\n   - Offers live tracking and alerts for users and bike owners\\n\\n4. **Payment Module**\\n   - Manages online digital payments \\n   - Offers auto payment options for users\\n\\n5. **Delivery Module**\\n   - Enables Google Maps integration for delivery personnel for efficient route planning\\n   - Manages delivery assignment and tracking for employees\\n\\n6. **Notification Module**\\n   - Sends notifications to users and bike owners for trips and updates\\n   - Offers customizable notification preferences and settings\\n\\n7. **Administration Module**\\n   - Manages system settings and configurations\\n   - Provides analytics and insights for bike rental trends and user behavior\\n\\n**Features:**\\n\\n1. **User-Friendly Search Engine**\\n   - Offers filters for distance and bike type\\n   - Provides real-time availability and bike information\\n\\n2. **Live Ride Tracking and Navigation**\\n   - Offers live updates and navigation for users and bike owners\\n   - Provides accurate location tracking and alerts\\n\\n3. **Digital Payments**\\n   - Offers auto payment options for users\\n   - Provides payment history and analytics\\n\\n4. **Delivery Services**\\n   - Employees are assigned to deliver bikes to users using Google Maps\\n   - Customers can track their delivery progress\\n\\n5. **Bike Owner Management**\\n   - Enables bike owners to list, edit, or remove bike listings\\n   - Provides bike rental history and analytics for bike owners\\n\\n**Data Flow:**\\n\\n1. User Registration and Login\\n   - User data stored in User Module database\\n   - User authentication and login handled by User Module\\n\\n2. Bike Listing and Management\\n   - Bike information stored in Bike Module database\\n   - Bike owners can list, edit, or remove bike listings through Bike Module\\n\\n3. Ride Tracking and Payment\\n   - Ride data stored in Ride Module database\\n   - Payment transactions handled by Payment Module\\n\\nUML Diagram:\\n```markdown\\n+---------------+\\n|    User    |\\n+---------------+\\n|  Registration  |\\n|  Login        |\\n|  Profile      |\\n|  Settings     |\\n+---------------+\\n\\n+---------------+\\n|    Bike    |\\n+---------------+\\n|  Listing     |\\n|  Availability|\\n|  Rental History|\\n+---------------+\\n\\n+---------------+\\n|    Ride    |\\n+---------------+\\n|  Tracking    |\\n|  Status     |\\n|  Navigation  |\\n+---------------+\\n\\n+---------------+\\n|   Delivery  |\\n+---------------+\\n|  Employee    |\\n|  Assignment  |\\n|  Tracking    |\\n|  Google Maps  |\\n+---------------+\\n\\n+---------------+\\n|  Payment     |\\n+---------------+\\n|  Online Digital  |\\n|  Payments     |\\n+---------------+\\n\\n+---------------+\\n| Notificaton |\\n+---------------+\\n|  Push         |\\n|  Email    |\\n+---------------+\\n\\n+---------------+\\n| Administration|\\n+---------------+\\n|  Settings     |\\n|  Configurations|\\n|  Insights    |\\n+---------------+\\n```\",\"image_path\":\"src/storage/diagrams/31_1766335471023.png\",\"uml_path\":\"C:\\\\Users\\\\irfan\\\\Downloads\\\\Nanda PDD\\\\Backend\\\\DAI-Investors Feature Backend\\\\src\\\\storage\\\\uml\\\\31_1766335471023.uml\"},\"business_advantage\":\"\",\"sent_at\":\"2026-01-03T07:44:19.164Z\"}', 1, 'ongoing', 'pending', 0, 0, '2026-01-03 07:44:19'),
(161, 31, 1, 3, 'Grip', 'Transportation & Mobility', '{\"project\":{\"pid\":31,\"title\":\"Grip\",\"category\":\"Transportation & Mobility\",\"version\":\"1.0.3\"},\"founder\":{\"uid\":1,\"name\":\"Nanda\",\"email\":\"nanda345@gmail.com\",\"phone\":\"6281806036\"},\"contents\":{\"summary\":\"**Modified Smart Bike Rental App Low-Level Design**\\n\\n**Modules:**\\n\\n1. **User Module**\\n   - Handles user registration, login, and authentication\\n   - Provides user profile management and settings\\n\\n2. **Bike Module**\\n   - Manages bike listings, availability, and rental history\\n   - Enables bike owners to list, edit, or remove bike listings\\n\\n3. **Ride Module**\\n   - Handles ride tracking, status, and navigation\\n   - Offers live tracking and alerts for users and bike owners\\n\\n4. **Payment Module**\\n   - Manages online digital payments \\n   - Offers auto payment options for users\\n\\n5. **Delivery Module**\\n   - Enables Google Maps integration for delivery personnel for efficient route planning\\n   - Manages delivery assignment and tracking for employees\\n\\n6. **Notification Module**\\n   - Sends notifications to users and bike owners for trips and updates\\n   - Offers customizable notification preferences and settings\\n\\n7. **Administration Module**\\n   - Manages system settings and configurations\\n   - Provides analytics and insights for bike rental trends and user behavior\\n\\n**Features:**\\n\\n1. **User-Friendly Search Engine**\\n   - Offers filters for distance and bike type\\n   - Provides real-time availability and bike information\\n\\n2. **Live Ride Tracking and Navigation**\\n   - Offers live updates and navigation for users and bike owners\\n   - Provides accurate location tracking and alerts\\n\\n3. **Digital Payments**\\n   - Offers auto payment options for users\\n   - Provides payment history and analytics\\n\\n4. **Delivery Services**\\n   - Employees are assigned to deliver bikes to users using Google Maps\\n   - Customers can track their delivery progress\\n\\n5. **Bike Owner Management**\\n   - Enables bike owners to list, edit, or remove bike listings\\n   - Provides bike rental history and analytics for bike owners\\n\\n**Data Flow:**\\n\\n1. User Registration and Login\\n   - User data stored in User Module database\\n   - User authentication and login handled by User Module\\n\\n2. Bike Listing and Management\\n   - Bike information stored in Bike Module database\\n   - Bike owners can list, edit, or remove bike listings through Bike Module\\n\\n3. Ride Tracking and Payment\\n   - Ride data stored in Ride Module database\\n   - Payment transactions handled by Payment Module\",\"lld\":\"**Modified Smart Bike Rental App Low-Level Design**\\n\\n**Modules:**\\n\\n1. **User Module**\\n   - Handles user registration, login, and authentication\\n   - Provides user profile management and settings\\n\\n2. **Bike Module**\\n   - Manages bike listings, availability, and rental history\\n   - Enables bike owners to list, edit, or remove bike listings\\n\\n3. **Ride Module**\\n   - Handles ride tracking, status, and navigation\\n   - Offers live tracking and alerts for users and bike owners\\n\\n4. **Payment Module**\\n   - Manages online digital payments \\n   - Offers auto payment options for users\\n\\n5. **Delivery Module**\\n   - Enables Google Maps integration for delivery personnel for efficient route planning\\n   - Manages delivery assignment and tracking for employees\\n\\n6. **Notification Module**\\n   - Sends notifications to users and bike owners for trips and updates\\n   - Offers customizable notification preferences and settings\\n\\n7. **Administration Module**\\n   - Manages system settings and configurations\\n   - Provides analytics and insights for bike rental trends and user behavior\\n\\n**Features:**\\n\\n1. **User-Friendly Search Engine**\\n   - Offers filters for distance and bike type\\n   - Provides real-time availability and bike information\\n\\n2. **Live Ride Tracking and Navigation**\\n   - Offers live updates and navigation for users and bike owners\\n   - Provides accurate location tracking and alerts\\n\\n3. **Digital Payments**\\n   - Offers auto payment options for users\\n   - Provides payment history and analytics\\n\\n4. **Delivery Services**\\n   - Employees are assigned to deliver bikes to users using Google Maps\\n   - Customers can track their delivery progress\\n\\n5. **Bike Owner Management**\\n   - Enables bike owners to list, edit, or remove bike listings\\n   - Provides bike rental history and analytics for bike owners\\n\\n**Data Flow:**\\n\\n1. User Registration and Login\\n   - User data stored in User Module database\\n   - User authentication and login handled by User Module\\n\\n2. Bike Listing and Management\\n   - Bike information stored in Bike Module database\\n   - Bike owners can list, edit, or remove bike listings through Bike Module\\n\\n3. Ride Tracking and Payment\\n   - Ride data stored in Ride Module database\\n   - Payment transactions handled by Payment Module\\n\\nUML Diagram:\\n```markdown\\n+---------------+\\n|    User    |\\n+---------------+\\n|  Registration  |\\n|  Login        |\\n|  Profile      |\\n|  Settings     |\\n+---------------+\\n\\n+---------------+\\n|    Bike    |\\n+---------------+\\n|  Listing     |\\n|  Availability|\\n|  Rental History|\\n+---------------+\\n\\n+---------------+\\n|    Ride    |\\n+---------------+\\n|  Tracking    |\\n|  Status     |\\n|  Navigation  |\\n+---------------+\\n\\n+---------------+\\n|   Delivery  |\\n+---------------+\\n|  Employee    |\\n|  Assignment  |\\n|  Tracking    |\\n|  Google Maps  |\\n+---------------+\\n\\n+---------------+\\n|  Payment     |\\n+---------------+\\n|  Online Digital  |\\n|  Payments     |\\n+---------------+\\n\\n+---------------+\\n| Notificaton |\\n+---------------+\\n|  Push         |\\n|  Email    |\\n+---------------+\\n\\n+---------------+\\n| Administration|\\n+---------------+\\n|  Settings     |\\n|  Configurations|\\n|  Insights    |\\n+---------------+\\n```\",\"image_path\":\"src/storage/diagrams/31_1766335471023.png\",\"uml_path\":\"C:\\\\Users\\\\irfan\\\\Downloads\\\\Nanda PDD\\\\Backend\\\\DAI-Investors Feature Backend\\\\src\\\\storage\\\\uml\\\\31_1766335471023.uml\"},\"business_advantage\":\"\",\"sent_at\":\"2026-01-03T07:44:19.164Z\"}', 1, 'ongoing', 'pending', 0, 0, '2026-01-03 07:44:19'),
(162, 31, 1, 4, 'Grip', 'Transportation & Mobility', '{\"project\":{\"pid\":31,\"title\":\"Grip\",\"category\":\"Transportation & Mobility\",\"version\":\"1.0.3\"},\"founder\":{\"uid\":1,\"name\":\"Nanda\",\"email\":\"nanda345@gmail.com\",\"phone\":\"6281806036\"},\"contents\":{\"summary\":\"**Modified Smart Bike Rental App Low-Level Design**\\n\\n**Modules:**\\n\\n1. **User Module**\\n   - Handles user registration, login, and authentication\\n   - Provides user profile management and settings\\n\\n2. **Bike Module**\\n   - Manages bike listings, availability, and rental history\\n   - Enables bike owners to list, edit, or remove bike listings\\n\\n3. **Ride Module**\\n   - Handles ride tracking, status, and navigation\\n   - Offers live tracking and alerts for users and bike owners\\n\\n4. **Payment Module**\\n   - Manages online digital payments \\n   - Offers auto payment options for users\\n\\n5. **Delivery Module**\\n   - Enables Google Maps integration for delivery personnel for efficient route planning\\n   - Manages delivery assignment and tracking for employees\\n\\n6. **Notification Module**\\n   - Sends notifications to users and bike owners for trips and updates\\n   - Offers customizable notification preferences and settings\\n\\n7. **Administration Module**\\n   - Manages system settings and configurations\\n   - Provides analytics and insights for bike rental trends and user behavior\\n\\n**Features:**\\n\\n1. **User-Friendly Search Engine**\\n   - Offers filters for distance and bike type\\n   - Provides real-time availability and bike information\\n\\n2. **Live Ride Tracking and Navigation**\\n   - Offers live updates and navigation for users and bike owners\\n   - Provides accurate location tracking and alerts\\n\\n3. **Digital Payments**\\n   - Offers auto payment options for users\\n   - Provides payment history and analytics\\n\\n4. **Delivery Services**\\n   - Employees are assigned to deliver bikes to users using Google Maps\\n   - Customers can track their delivery progress\\n\\n5. **Bike Owner Management**\\n   - Enables bike owners to list, edit, or remove bike listings\\n   - Provides bike rental history and analytics for bike owners\\n\\n**Data Flow:**\\n\\n1. User Registration and Login\\n   - User data stored in User Module database\\n   - User authentication and login handled by User Module\\n\\n2. Bike Listing and Management\\n   - Bike information stored in Bike Module database\\n   - Bike owners can list, edit, or remove bike listings through Bike Module\\n\\n3. Ride Tracking and Payment\\n   - Ride data stored in Ride Module database\\n   - Payment transactions handled by Payment Module\",\"lld\":\"**Modified Smart Bike Rental App Low-Level Design**\\n\\n**Modules:**\\n\\n1. **User Module**\\n   - Handles user registration, login, and authentication\\n   - Provides user profile management and settings\\n\\n2. **Bike Module**\\n   - Manages bike listings, availability, and rental history\\n   - Enables bike owners to list, edit, or remove bike listings\\n\\n3. **Ride Module**\\n   - Handles ride tracking, status, and navigation\\n   - Offers live tracking and alerts for users and bike owners\\n\\n4. **Payment Module**\\n   - Manages online digital payments \\n   - Offers auto payment options for users\\n\\n5. **Delivery Module**\\n   - Enables Google Maps integration for delivery personnel for efficient route planning\\n   - Manages delivery assignment and tracking for employees\\n\\n6. **Notification Module**\\n   - Sends notifications to users and bike owners for trips and updates\\n   - Offers customizable notification preferences and settings\\n\\n7. **Administration Module**\\n   - Manages system settings and configurations\\n   - Provides analytics and insights for bike rental trends and user behavior\\n\\n**Features:**\\n\\n1. **User-Friendly Search Engine**\\n   - Offers filters for distance and bike type\\n   - Provides real-time availability and bike information\\n\\n2. **Live Ride Tracking and Navigation**\\n   - Offers live updates and navigation for users and bike owners\\n   - Provides accurate location tracking and alerts\\n\\n3. **Digital Payments**\\n   - Offers auto payment options for users\\n   - Provides payment history and analytics\\n\\n4. **Delivery Services**\\n   - Employees are assigned to deliver bikes to users using Google Maps\\n   - Customers can track their delivery progress\\n\\n5. **Bike Owner Management**\\n   - Enables bike owners to list, edit, or remove bike listings\\n   - Provides bike rental history and analytics for bike owners\\n\\n**Data Flow:**\\n\\n1. User Registration and Login\\n   - User data stored in User Module database\\n   - User authentication and login handled by User Module\\n\\n2. Bike Listing and Management\\n   - Bike information stored in Bike Module database\\n   - Bike owners can list, edit, or remove bike listings through Bike Module\\n\\n3. Ride Tracking and Payment\\n   - Ride data stored in Ride Module database\\n   - Payment transactions handled by Payment Module\\n\\nUML Diagram:\\n```markdown\\n+---------------+\\n|    User    |\\n+---------------+\\n|  Registration  |\\n|  Login        |\\n|  Profile      |\\n|  Settings     |\\n+---------------+\\n\\n+---------------+\\n|    Bike    |\\n+---------------+\\n|  Listing     |\\n|  Availability|\\n|  Rental History|\\n+---------------+\\n\\n+---------------+\\n|    Ride    |\\n+---------------+\\n|  Tracking    |\\n|  Status     |\\n|  Navigation  |\\n+---------------+\\n\\n+---------------+\\n|   Delivery  |\\n+---------------+\\n|  Employee    |\\n|  Assignment  |\\n|  Tracking    |\\n|  Google Maps  |\\n+---------------+\\n\\n+---------------+\\n|  Payment     |\\n+---------------+\\n|  Online Digital  |\\n|  Payments     |\\n+---------------+\\n\\n+---------------+\\n| Notificaton |\\n+---------------+\\n|  Push         |\\n|  Email    |\\n+---------------+\\n\\n+---------------+\\n| Administration|\\n+---------------+\\n|  Settings     |\\n|  Configurations|\\n|  Insights    |\\n+---------------+\\n```\",\"image_path\":\"src/storage/diagrams/31_1766335471023.png\",\"uml_path\":\"C:\\\\Users\\\\irfan\\\\Downloads\\\\Nanda PDD\\\\Backend\\\\DAI-Investors Feature Backend\\\\src\\\\storage\\\\uml\\\\31_1766335471023.uml\"},\"business_advantage\":\"\",\"sent_at\":\"2026-01-03T07:44:19.164Z\"}', 1, 'ongoing', 'pending', 0, 0, '2026-01-03 07:44:19'),
(163, 31, 1, 6, 'Grip', 'Transportation & Mobility', '{\"project\":{\"pid\":31,\"title\":\"Grip\",\"category\":\"Transportation & Mobility\",\"version\":\"1.0.3\"},\"founder\":{\"uid\":1,\"name\":\"Nanda\",\"email\":\"nanda345@gmail.com\",\"phone\":\"6281806036\"},\"contents\":{\"summary\":\"**Modified Smart Bike Rental App Low-Level Design**\\n\\n**Modules:**\\n\\n1. **User Module**\\n   - Handles user registration, login, and authentication\\n   - Provides user profile management and settings\\n\\n2. **Bike Module**\\n   - Manages bike listings, availability, and rental history\\n   - Enables bike owners to list, edit, or remove bike listings\\n\\n3. **Ride Module**\\n   - Handles ride tracking, status, and navigation\\n   - Offers live tracking and alerts for users and bike owners\\n\\n4. **Payment Module**\\n   - Manages online digital payments \\n   - Offers auto payment options for users\\n\\n5. **Delivery Module**\\n   - Enables Google Maps integration for delivery personnel for efficient route planning\\n   - Manages delivery assignment and tracking for employees\\n\\n6. **Notification Module**\\n   - Sends notifications to users and bike owners for trips and updates\\n   - Offers customizable notification preferences and settings\\n\\n7. **Administration Module**\\n   - Manages system settings and configurations\\n   - Provides analytics and insights for bike rental trends and user behavior\\n\\n**Features:**\\n\\n1. **User-Friendly Search Engine**\\n   - Offers filters for distance and bike type\\n   - Provides real-time availability and bike information\\n\\n2. **Live Ride Tracking and Navigation**\\n   - Offers live updates and navigation for users and bike owners\\n   - Provides accurate location tracking and alerts\\n\\n3. **Digital Payments**\\n   - Offers auto payment options for users\\n   - Provides payment history and analytics\\n\\n4. **Delivery Services**\\n   - Employees are assigned to deliver bikes to users using Google Maps\\n   - Customers can track their delivery progress\\n\\n5. **Bike Owner Management**\\n   - Enables bike owners to list, edit, or remove bike listings\\n   - Provides bike rental history and analytics for bike owners\\n\\n**Data Flow:**\\n\\n1. User Registration and Login\\n   - User data stored in User Module database\\n   - User authentication and login handled by User Module\\n\\n2. Bike Listing and Management\\n   - Bike information stored in Bike Module database\\n   - Bike owners can list, edit, or remove bike listings through Bike Module\\n\\n3. Ride Tracking and Payment\\n   - Ride data stored in Ride Module database\\n   - Payment transactions handled by Payment Module\",\"lld\":\"**Modified Smart Bike Rental App Low-Level Design**\\n\\n**Modules:**\\n\\n1. **User Module**\\n   - Handles user registration, login, and authentication\\n   - Provides user profile management and settings\\n\\n2. **Bike Module**\\n   - Manages bike listings, availability, and rental history\\n   - Enables bike owners to list, edit, or remove bike listings\\n\\n3. **Ride Module**\\n   - Handles ride tracking, status, and navigation\\n   - Offers live tracking and alerts for users and bike owners\\n\\n4. **Payment Module**\\n   - Manages online digital payments \\n   - Offers auto payment options for users\\n\\n5. **Delivery Module**\\n   - Enables Google Maps integration for delivery personnel for efficient route planning\\n   - Manages delivery assignment and tracking for employees\\n\\n6. **Notification Module**\\n   - Sends notifications to users and bike owners for trips and updates\\n   - Offers customizable notification preferences and settings\\n\\n7. **Administration Module**\\n   - Manages system settings and configurations\\n   - Provides analytics and insights for bike rental trends and user behavior\\n\\n**Features:**\\n\\n1. **User-Friendly Search Engine**\\n   - Offers filters for distance and bike type\\n   - Provides real-time availability and bike information\\n\\n2. **Live Ride Tracking and Navigation**\\n   - Offers live updates and navigation for users and bike owners\\n   - Provides accurate location tracking and alerts\\n\\n3. **Digital Payments**\\n   - Offers auto payment options for users\\n   - Provides payment history and analytics\\n\\n4. **Delivery Services**\\n   - Employees are assigned to deliver bikes to users using Google Maps\\n   - Customers can track their delivery progress\\n\\n5. **Bike Owner Management**\\n   - Enables bike owners to list, edit, or remove bike listings\\n   - Provides bike rental history and analytics for bike owners\\n\\n**Data Flow:**\\n\\n1. User Registration and Login\\n   - User data stored in User Module database\\n   - User authentication and login handled by User Module\\n\\n2. Bike Listing and Management\\n   - Bike information stored in Bike Module database\\n   - Bike owners can list, edit, or remove bike listings through Bike Module\\n\\n3. Ride Tracking and Payment\\n   - Ride data stored in Ride Module database\\n   - Payment transactions handled by Payment Module\\n\\nUML Diagram:\\n```markdown\\n+---------------+\\n|    User    |\\n+---------------+\\n|  Registration  |\\n|  Login        |\\n|  Profile      |\\n|  Settings     |\\n+---------------+\\n\\n+---------------+\\n|    Bike    |\\n+---------------+\\n|  Listing     |\\n|  Availability|\\n|  Rental History|\\n+---------------+\\n\\n+---------------+\\n|    Ride    |\\n+---------------+\\n|  Tracking    |\\n|  Status     |\\n|  Navigation  |\\n+---------------+\\n\\n+---------------+\\n|   Delivery  |\\n+---------------+\\n|  Employee    |\\n|  Assignment  |\\n|  Tracking    |\\n|  Google Maps  |\\n+---------------+\\n\\n+---------------+\\n|  Payment     |\\n+---------------+\\n|  Online Digital  |\\n|  Payments     |\\n+---------------+\\n\\n+---------------+\\n| Notificaton |\\n+---------------+\\n|  Push         |\\n|  Email    |\\n+---------------+\\n\\n+---------------+\\n| Administration|\\n+---------------+\\n|  Settings     |\\n|  Configurations|\\n|  Insights    |\\n+---------------+\\n```\",\"image_path\":\"src/storage/diagrams/31_1766335471023.png\",\"uml_path\":\"C:\\\\Users\\\\irfan\\\\Downloads\\\\Nanda PDD\\\\Backend\\\\DAI-Investors Feature Backend\\\\src\\\\storage\\\\uml\\\\31_1766335471023.uml\"},\"business_advantage\":\"\",\"sent_at\":\"2026-01-03T07:44:19.164Z\"}', 1, 'ongoing', 'pending', 0, 0, '2026-01-03 07:44:19'),
(164, 31, 4, 1, 'Grip', 'Transportation & Mobility', '{\"project\":{\"pid\":31,\"title\":\"Grip\",\"category\":\"Transportation & Mobility\",\"version\":\"1.0.3\"},\"founder\":{\"uid\":1,\"name\":\"Nanda\",\"email\":\"nanda345@gmail.com\",\"phone\":\"6281806036\"},\"contents\":{\"summary\":\"**Modified Smart Bike Rental App Low-Level Design**\\n\\n**Modules:**\\n\\n1. **User Module**\\n   - Handles user registration, login, and authentication\\n   - Provides user profile management and settings\\n\\n2. **Bike Module**\\n   - Manages bike listings, availability, and rental history\\n   - Enables bike owners to list, edit, or remove bike listings\\n\\n3. **Ride Module**\\n   - Handles ride tracking, status, and navigation\\n   - Offers live tracking and alerts for users and bike owners\\n\\n4. **Payment Module**\\n   - Manages online digital payments \\n   - Offers auto payment options for users\\n\\n5. **Delivery Module**\\n   - Enables Google Maps integration for delivery personnel for efficient route planning\\n   - Manages delivery assignment and tracking for employees\\n\\n6. **Notification Module**\\n   - Sends notifications to users and bike owners for trips and updates\\n   - Offers customizable notification preferences and settings\\n\\n7. **Administration Module**\\n   - Manages system settings and configurations\\n   - Provides analytics and insights for bike rental trends and user behavior\\n\\n**Features:**\\n\\n1. **User-Friendly Search Engine**\\n   - Offers filters for distance and bike type\\n   - Provides real-time availability and bike information\\n\\n2. **Live Ride Tracking and Navigation**\\n   - Offers live updates and navigation for users and bike owners\\n   - Provides accurate location tracking and alerts\\n\\n3. **Digital Payments**\\n   - Offers auto payment options for users\\n   - Provides payment history and analytics\\n\\n4. **Delivery Services**\\n   - Employees are assigned to deliver bikes to users using Google Maps\\n   - Customers can track their delivery progress\\n\\n5. **Bike Owner Management**\\n   - Enables bike owners to list, edit, or remove bike listings\\n   - Provides bike rental history and analytics for bike owners\\n\\n**Data Flow:**\\n\\n1. User Registration and Login\\n   - User data stored in User Module database\\n   - User authentication and login handled by User Module\\n\\n2. Bike Listing and Management\\n   - Bike information stored in Bike Module database\\n   - Bike owners can list, edit, or remove bike listings through Bike Module\\n\\n3. Ride Tracking and Payment\\n   - Ride data stored in Ride Module database\\n   - Payment transactions handled by Payment Module\",\"lld\":\"**Modified Smart Bike Rental App Low-Level Design**\\n\\n**Modules:**\\n\\n1. **User Module**\\n   - Handles user registration, login, and authentication\\n   - Provides user profile management and settings\\n\\n2. **Bike Module**\\n   - Manages bike listings, availability, and rental history\\n   - Enables bike owners to list, edit, or remove bike listings\\n\\n3. **Ride Module**\\n   - Handles ride tracking, status, and navigation\\n   - Offers live tracking and alerts for users and bike owners\\n\\n4. **Payment Module**\\n   - Manages online digital payments \\n   - Offers auto payment options for users\\n\\n5. **Delivery Module**\\n   - Enables Google Maps integration for delivery personnel for efficient route planning\\n   - Manages delivery assignment and tracking for employees\\n\\n6. **Notification Module**\\n   - Sends notifications to users and bike owners for trips and updates\\n   - Offers customizable notification preferences and settings\\n\\n7. **Administration Module**\\n   - Manages system settings and configurations\\n   - Provides analytics and insights for bike rental trends and user behavior\\n\\n**Features:**\\n\\n1. **User-Friendly Search Engine**\\n   - Offers filters for distance and bike type\\n   - Provides real-time availability and bike information\\n\\n2. **Live Ride Tracking and Navigation**\\n   - Offers live updates and navigation for users and bike owners\\n   - Provides accurate location tracking and alerts\\n\\n3. **Digital Payments**\\n   - Offers auto payment options for users\\n   - Provides payment history and analytics\\n\\n4. **Delivery Services**\\n   - Employees are assigned to deliver bikes to users using Google Maps\\n   - Customers can track their delivery progress\\n\\n5. **Bike Owner Management**\\n   - Enables bike owners to list, edit, or remove bike listings\\n   - Provides bike rental history and analytics for bike owners\\n\\n**Data Flow:**\\n\\n1. User Registration and Login\\n   - User data stored in User Module database\\n   - User authentication and login handled by User Module\\n\\n2. Bike Listing and Management\\n   - Bike information stored in Bike Module database\\n   - Bike owners can list, edit, or remove bike listings through Bike Module\\n\\n3. Ride Tracking and Payment\\n   - Ride data stored in Ride Module database\\n   - Payment transactions handled by Payment Module\\n\\nUML Diagram:\\n```markdown\\n+---------------+\\n|    User    |\\n+---------------+\\n|  Registration  |\\n|  Login        |\\n|  Profile      |\\n|  Settings     |\\n+---------------+\\n\\n+---------------+\\n|    Bike    |\\n+---------------+\\n|  Listing     |\\n|  Availability|\\n|  Rental History|\\n+---------------+\\n\\n+---------------+\\n|    Ride    |\\n+---------------+\\n|  Tracking    |\\n|  Status     |\\n|  Navigation  |\\n+---------------+\\n\\n+---------------+\\n|   Delivery  |\\n+---------------+\\n|  Employee    |\\n|  Assignment  |\\n|  Tracking    |\\n|  Google Maps  |\\n+---------------+\\n\\n+---------------+\\n|  Payment     |\\n+---------------+\\n|  Online Digital  |\\n|  Payments     |\\n+---------------+\\n\\n+---------------+\\n| Notificaton |\\n+---------------+\\n|  Push         |\\n|  Email    |\\n+---------------+\\n\\n+---------------+\\n| Administration|\\n+---------------+\\n|  Settings     |\\n|  Configurations|\\n|  Insights    |\\n+---------------+\\n```\",\"image_path\":\"src/storage/diagrams/31_1766335471023.png\",\"uml_path\":\"C:\\\\Users\\\\irfan\\\\Downloads\\\\Nanda PDD\\\\Backend\\\\DAI-Investors Feature Backend\\\\src\\\\storage\\\\uml\\\\31_1766335471023.uml\"},\"business_advantage\":\"\",\"sent_at\":\"2026-01-03T07:44:19.164Z\"}', 1, 'ongoing', 'accepted', 1, 0, '2026-01-03 07:44:25');
INSERT INTO `project_requests` (`id`, `pid`, `requestby_uid`, `responseby_uid`, `title`, `category`, `package`, `is_hub`, `dev_status`, `response_status`, `chat_access`, `is_invested`, `created_at`) VALUES
(165, 31, 4, 1, 'Grip', 'Transportation & Mobility', '{\"project\":{\"pid\":31,\"title\":\"Grip\",\"category\":\"Transportation & Mobility\",\"version\":\"1.0.3\"},\"founder\":{\"uid\":1,\"name\":\"Nanda\",\"email\":\"nanda345@gmail.com\",\"phone\":\"6281806036\"},\"contents\":{\"summary\":\"**Modified Smart Bike Rental App Low-Level Design**\\n\\n**Modules:**\\n\\n1. **User Module**\\n   - Handles user registration, login, and authentication\\n   - Provides user profile management and settings\\n\\n2. **Bike Module**\\n   - Manages bike listings, availability, and rental history\\n   - Enables bike owners to list, edit, or remove bike listings\\n\\n3. **Ride Module**\\n   - Handles ride tracking, status, and navigation\\n   - Offers live tracking and alerts for users and bike owners\\n\\n4. **Payment Module**\\n   - Manages online digital payments \\n   - Offers auto payment options for users\\n\\n5. **Delivery Module**\\n   - Enables Google Maps integration for delivery personnel for efficient route planning\\n   - Manages delivery assignment and tracking for employees\\n\\n6. **Notification Module**\\n   - Sends notifications to users and bike owners for trips and updates\\n   - Offers customizable notification preferences and settings\\n\\n7. **Administration Module**\\n   - Manages system settings and configurations\\n   - Provides analytics and insights for bike rental trends and user behavior\\n\\n**Features:**\\n\\n1. **User-Friendly Search Engine**\\n   - Offers filters for distance and bike type\\n   - Provides real-time availability and bike information\\n\\n2. **Live Ride Tracking and Navigation**\\n   - Offers live updates and navigation for users and bike owners\\n   - Provides accurate location tracking and alerts\\n\\n3. **Digital Payments**\\n   - Offers auto payment options for users\\n   - Provides payment history and analytics\\n\\n4. **Delivery Services**\\n   - Employees are assigned to deliver bikes to users using Google Maps\\n   - Customers can track their delivery progress\\n\\n5. **Bike Owner Management**\\n   - Enables bike owners to list, edit, or remove bike listings\\n   - Provides bike rental history and analytics for bike owners\\n\\n**Data Flow:**\\n\\n1. User Registration and Login\\n   - User data stored in User Module database\\n   - User authentication and login handled by User Module\\n\\n2. Bike Listing and Management\\n   - Bike information stored in Bike Module database\\n   - Bike owners can list, edit, or remove bike listings through Bike Module\\n\\n3. Ride Tracking and Payment\\n   - Ride data stored in Ride Module database\\n   - Payment transactions handled by Payment Module\",\"lld\":\"**Modified Smart Bike Rental App Low-Level Design**\\n\\n**Modules:**\\n\\n1. **User Module**\\n   - Handles user registration, login, and authentication\\n   - Provides user profile management and settings\\n\\n2. **Bike Module**\\n   - Manages bike listings, availability, and rental history\\n   - Enables bike owners to list, edit, or remove bike listings\\n\\n3. **Ride Module**\\n   - Handles ride tracking, status, and navigation\\n   - Offers live tracking and alerts for users and bike owners\\n\\n4. **Payment Module**\\n   - Manages online digital payments \\n   - Offers auto payment options for users\\n\\n5. **Delivery Module**\\n   - Enables Google Maps integration for delivery personnel for efficient route planning\\n   - Manages delivery assignment and tracking for employees\\n\\n6. **Notification Module**\\n   - Sends notifications to users and bike owners for trips and updates\\n   - Offers customizable notification preferences and settings\\n\\n7. **Administration Module**\\n   - Manages system settings and configurations\\n   - Provides analytics and insights for bike rental trends and user behavior\\n\\n**Features:**\\n\\n1. **User-Friendly Search Engine**\\n   - Offers filters for distance and bike type\\n   - Provides real-time availability and bike information\\n\\n2. **Live Ride Tracking and Navigation**\\n   - Offers live updates and navigation for users and bike owners\\n   - Provides accurate location tracking and alerts\\n\\n3. **Digital Payments**\\n   - Offers auto payment options for users\\n   - Provides payment history and analytics\\n\\n4. **Delivery Services**\\n   - Employees are assigned to deliver bikes to users using Google Maps\\n   - Customers can track their delivery progress\\n\\n5. **Bike Owner Management**\\n   - Enables bike owners to list, edit, or remove bike listings\\n   - Provides bike rental history and analytics for bike owners\\n\\n**Data Flow:**\\n\\n1. User Registration and Login\\n   - User data stored in User Module database\\n   - User authentication and login handled by User Module\\n\\n2. Bike Listing and Management\\n   - Bike information stored in Bike Module database\\n   - Bike owners can list, edit, or remove bike listings through Bike Module\\n\\n3. Ride Tracking and Payment\\n   - Ride data stored in Ride Module database\\n   - Payment transactions handled by Payment Module\\n\\nUML Diagram:\\n```markdown\\n+---------------+\\n|    User    |\\n+---------------+\\n|  Registration  |\\n|  Login        |\\n|  Profile      |\\n|  Settings     |\\n+---------------+\\n\\n+---------------+\\n|    Bike    |\\n+---------------+\\n|  Listing     |\\n|  Availability|\\n|  Rental History|\\n+---------------+\\n\\n+---------------+\\n|    Ride    |\\n+---------------+\\n|  Tracking    |\\n|  Status     |\\n|  Navigation  |\\n+---------------+\\n\\n+---------------+\\n|   Delivery  |\\n+---------------+\\n|  Employee    |\\n|  Assignment  |\\n|  Tracking    |\\n|  Google Maps  |\\n+---------------+\\n\\n+---------------+\\n|  Payment     |\\n+---------------+\\n|  Online Digital  |\\n|  Payments     |\\n+---------------+\\n\\n+---------------+\\n| Notificaton |\\n+---------------+\\n|  Push         |\\n|  Email    |\\n+---------------+\\n\\n+---------------+\\n| Administration|\\n+---------------+\\n|  Settings     |\\n|  Configurations|\\n|  Insights    |\\n+---------------+\\n```\",\"image_path\":\"src/storage/diagrams/31_1766335471023.png\",\"uml_path\":\"C:\\\\Users\\\\irfan\\\\Downloads\\\\Nanda PDD\\\\Backend\\\\DAI-Investors Feature Backend\\\\src\\\\storage\\\\uml\\\\31_1766335471023.uml\"},\"business_advantage\":\"\",\"sent_at\":\"2026-01-03T07:44:19.164Z\"}', 1, 'ongoing', 'rejected', 0, 0, '2026-01-03 08:01:50');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `uid` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `is_investor` tinyint(1) DEFAULT 0,
  `company_name` varchar(255) DEFAULT NULL,
  `linkedin_url` varchar(500) DEFAULT NULL,
  `website_url` varchar(500) DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `past_investments` text DEFAULT NULL,
  `investment_type` varchar(100) DEFAULT NULL,
  `min_investment` decimal(12,2) DEFAULT NULL,
  `max_investment` decimal(12,2) DEFAULT NULL,
  `preferred_categories` text DEFAULT NULL,
  `profile_image` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`uid`, `name`, `phone`, `email`, `password`, `is_investor`, `company_name`, `linkedin_url`, `website_url`, `bio`, `past_investments`, `investment_type`, `min_investment`, `max_investment`, `preferred_categories`, `profile_image`, `created_at`, `updated_at`) VALUES
(1, 'Nanda', '6281806036', 'nanda345@gmail.com', '$2b$10$dokyR4dcxKVYKeJK8HmV6OGasAY8nWFMcRpg67F/wSiYrTNl/sfY6', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-20 05:22:21', '2025-12-20 05:22:21'),
(2, 'Nanda Gopala Krishna Vasala', '8015910256', 'ngk@gmail.com', '$2b$10$GhOBUaxwzmSr4cPvZl0PAOKf6n3l39hoD5QbwMal.t7Jne3G1Ng0W', 1, 'Delloite', NULL, NULL, 'I\'m an investor', NULL, 'Angel', 500.00, 5000.00, '[Commerce & Retail, Food & Hospitality, Health & Wellness]', NULL, '2025-12-20 05:23:19', '2025-12-20 05:23:19'),
(3, 'Nanda Gopala Krishna Vasala', '949595', 'vasalanandagopalakrishna@gmail.com', '$2b$10$KB1GsyWdte3hmXAuYNrIUe7a/LoAGAZm4m.YzaNv8/l1qB7qEanNm', 1, 'hdj', NULL, NULL, 'jeje', NULL, 'VC', 598.00, 8668.00, '[Food & Hospitality, Health & Wellness, Transportation & Mobility]', NULL, '2025-12-20 05:26:34', '2025-12-28 04:26:11'),
(4, 'abc', '987654321', 'abc@gmail.com', '$2b$10$OoOwblxVXC/PJLPWnF3u4OSbZZKL/qERGajPheI6SsnQb15n83bSi', 1, 'hdj', NULL, NULL, 'abc is my name', NULL, 'Angel', 6000.00, 60000.00, '[Commerce & Retail, Food & Hospitality, Health & Wellness, Transportation & Mobility]', 'profile/user_4.png', '2025-12-22 14:59:43', '2025-12-24 04:09:03'),
(5, 'Chethan', '987654321', 'c@gmail.com', '$2b$10$ItdcSJS7LG.uJ3O8NzIChORi5UN080LvVfaVijOQsuHrM0Yyszf.e', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-01-02 14:45:44', '2026-01-02 14:45:44'),
(6, 'dileep', '987654321', 'd@gmail.com', '$2b$10$iPdj3o1rXCxDzmuTDk2jK.gbrFWGwobGQyutKBd3W28Z3D1PGz9RK', 1, 'djp', NULL, NULL, 'I\'m dileep', NULL, 'Angel', 500.00, 50000.00, '[Food & Hospitality, Health & Wellness, Transportation & Mobility]', NULL, '2026-01-02 14:46:48', '2026-01-02 14:46:48');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `category_name` (`category_name`);

--
-- Indexes for table `chats`
--
ALTER TABLE `chats`
  ADD PRIMARY KEY (`chat_id`),
  ADD UNIQUE KEY `unique_request_chat` (`request_id`),
  ADD KEY `idx_requestby` (`requestby_uid`),
  ADD KEY `idx_responseby` (`responseby_uid`);

--
-- Indexes for table `chat_messages`
--
ALTER TABLE `chat_messages`
  ADD PRIMARY KEY (`message_id`),
  ADD KEY `idx_chat` (`chat_id`),
  ADD KEY `idx_sender` (`sender_uid`);

--
-- Indexes for table `password_resets`
--
ALTER TABLE `password_resets`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_email` (`email`);

--
-- Indexes for table `projects`
--
ALTER TABLE `projects`
  ADD PRIMARY KEY (`pid`),
  ADD KEY `uid` (`uid`);

--
-- Indexes for table `project_requests`
--
ALTER TABLE `project_requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_pr_project` (`pid`),
  ADD KEY `fk_pr_requestby` (`requestby_uid`),
  ADD KEY `fk_pr_responseby` (`responseby_uid`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`uid`),
  ADD UNIQUE KEY `unique_email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `chats`
--
ALTER TABLE `chats`
  MODIFY `chat_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `chat_messages`
--
ALTER TABLE `chat_messages`
  MODIFY `message_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT for table `password_resets`
--
ALTER TABLE `password_resets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `projects`
--
ALTER TABLE `projects`
  MODIFY `pid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT for table `project_requests`
--
ALTER TABLE `project_requests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=166;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `uid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `chats`
--
ALTER TABLE `chats`
  ADD CONSTRAINT `fk_chat_request` FOREIGN KEY (`request_id`) REFERENCES `project_requests` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `chat_messages`
--
ALTER TABLE `chat_messages`
  ADD CONSTRAINT `fk_message_chat` FOREIGN KEY (`chat_id`) REFERENCES `chats` (`chat_id`) ON DELETE CASCADE;

--
-- Constraints for table `projects`
--
ALTER TABLE `projects`
  ADD CONSTRAINT `projects_ibfk_1` FOREIGN KEY (`uid`) REFERENCES `users` (`uid`);

--
-- Constraints for table `project_requests`
--
ALTER TABLE `project_requests`
  ADD CONSTRAINT `fk_pr_project` FOREIGN KEY (`pid`) REFERENCES `projects` (`pid`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_pr_requestby` FOREIGN KEY (`requestby_uid`) REFERENCES `users` (`uid`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_pr_responseby` FOREIGN KEY (`responseby_uid`) REFERENCES `users` (`uid`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
