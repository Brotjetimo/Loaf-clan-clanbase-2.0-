-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Gegenereerd op: 07 jan 2025 om 11:39
-- Serverversie: 10.4.32-MariaDB
-- PHP-versie: 8.2.12

CREATE DATABASE IF NOT EXISTS loaf_clan;

USE loaf_clan;

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Gegenereerd op: 23 jan 2025 om 11:08
-- Serverversie: 10.4.32-MariaDB
-- PHP-versie: 8.2.12


SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `loaf-clan`
--

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `competitions`
--

CREATE TABLE `competitions` (
  `competition_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `game` varchar(255) NOT NULL,
  `max_teams` int(11) NOT NULL DEFAULT 10,
  `game_type` varchar(15) DEFAULT NULL,
  `expiry_time` datetime DEFAULT NULL,
  `competition_type` varchar(50) NOT NULL DEFAULT 'default'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Gegevens worden geëxporteerd voor tabel `competitions`
--

INSERT INTO `competitions` (`competition_id`, `name`, `description`, `start_date`, `end_date`, `created_at`, `updated_at`, `game`, `max_teams`, `game_type`, `expiry_time`, `competition_type`) VALUES
(1, 'pollo', NULL, '1111-11-11', '0000-00-00', '2024-12-12 13:16:17', '2024-12-12 13:16:17', '', 10, NULL, NULL, 'default'),
(5, 'timo world', 'yooo', '2025-01-15', '2025-01-15', '2025-01-15 13:27:24', '2025-01-15 13:27:24', 'csgo', 2, 'platform', NULL, 'pvp'),
(6, 'pollosworld', 'hunt', '2025-01-14', '2025-01-15', '2025-01-15 13:45:02', '2025-01-15 13:45:02', 'duckhunt', 3, 'shooter', NULL, 'team'),
(7, 'jansworld', 'pollo', '2025-01-15', '2025-01-15', '2025-01-15 13:45:40', '2025-01-15 13:45:40', 'china', 3, 'shooter', NULL, 'team'),
(8, 'cheese', 'yolo', '2025-01-20', '2025-01-21', '2025-01-22 13:07:15', '2025-01-22 13:07:15', 'csgo', 2, 'Shooters', NULL, 'Teams'),
(21, 'fr', 'frf', '2025-01-21', '2025-01-22', '2025-01-22 13:56:17', '2025-01-22 13:56:17', 'frf', 2, 'Shooters', NULL, 'Pvp');

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `competition_confirmations`
--

CREATE TABLE `competition_confirmations` (
  `confirmation_id` int(11) NOT NULL,
  `competition_id` int(11) NOT NULL,
  `team_id` int(11) NOT NULL,
  `reported_result` enum('win','loss') NOT NULL,
  `confirmed_by_leader` tinyint(1) DEFAULT 0,
  `reported_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Gegevens worden geëxporteerd voor tabel `competition_confirmations`
--

INSERT INTO `competition_confirmations` (`confirmation_id`, `competition_id`, `team_id`, `reported_result`, `confirmed_by_leader`, `reported_at`) VALUES
(8, 5, 3, 'win', 1, '2025-01-17 10:33:36');

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `competition_results`
--

CREATE TABLE `competition_results` (
  `id` int(11) NOT NULL,
  `competition_id` int(11) NOT NULL,
  `team_id` int(11) NOT NULL,
  `winning_team_id` int(11) DEFAULT NULL,
  `losing_team_id` int(11) DEFAULT NULL,
  `result_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `points` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Gegevens worden geëxporteerd voor tabel `competition_results`
--

INSERT INTO `competition_results` (`id`, `competition_id`, `team_id`, `winning_team_id`, `losing_team_id`, `result_date`, `points`) VALUES
(66, 5, 3, NULL, 0, '2025-01-30 11:57:40', 76),
(67, 5, 16, NULL, 0, '2025-01-30 11:57:40', 14);

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `competition_teams`
--

CREATE TABLE `competition_teams` (
  `competition_team_id` int(11) NOT NULL,
  `competition_id` int(11) NOT NULL,
  `team_id` int(11) NOT NULL,
  `registration_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Gegevens worden geëxporteerd voor tabel `competition_teams`
--

INSERT INTO `competition_teams` (`competition_team_id`, `competition_id`, `team_id`, `registration_date`) VALUES
(2, 1, 3, '2024-12-18 13:14:26'),
(13, 5, 3, '2025-01-15 13:49:27'),
(14, 5, 16, '2025-01-15 13:50:28'),
(15, 6, 3, '2025-01-30 10:41:10'),
(16, 6, 15, '2025-01-30 10:41:29'),
(17, 6, 16, '2025-01-30 10:42:16');

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `notifications`
--

CREATE TABLE `notifications` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `team_id` int(11) DEFAULT NULL,
  `status` enum('pending','accepted','declined') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `type` varchar(255) NOT NULL DEFAULT 'team_invite'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `teams`
--

CREATE TABLE `teams` (
  `team_id` int(11) NOT NULL,
  `team_name` varchar(100) NOT NULL,
  `wins` int(11) DEFAULT 0,
  `losses` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Gegevens worden geëxporteerd voor tabel `teams`
--

INSERT INTO `teams` (`team_id`, `team_name`, `wins`, `losses`) VALUES
(3, 'aa', 21, 18),
(15, 'pollo', 10, 6),
(16, 'pollateam', 13, 16);

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `username` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `age` int(11) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `gamepreference` varchar(255) DEFAULT NULL,
  `user_role` enum('admin','user') DEFAULT 'user'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Gegevens worden geëxporteerd voor tabel `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `age`, `email`, `gamepreference`, `user_role`) VALUES
(1, 'lol', '$2a$10$PRwwlhe4Ol9ePC/MNbhaBujHehKqzTRYSJu9GPI1bg3ZrQiJIFPeW', NULL, NULL, 'Shooter', 'admin'),
(2, 'pollo', '$2a$10$cazXOd9EkNdEajIw2vUhBOk5oNzR9ZCoGp9jPhF765wUWNqCq2Ibu', 12, 'pollo@gmail.com', '', 'user'),
(4, 'polla', '$2a$10$huvrtiSGK9zXI1oEFrLifOCvRDj2vZ7cK2Plq6VQrXzz0gFJubMxC', 12, 'polla@gmail.com', 'platform fighters', 'user'),
(11, 'jan', '$2a$10$BimyWZWnHkvmP1dkj66yTe14mnGmjFwlX/uVh8RGUIC0rMglEHHwq', 2, 'jan@gmai.com', 'speedrunning', 'user'),
(12, 'rliefhebbet@gmail.com', '$2a$10$10uAlAvlUky4qAJKjTG.6..mJlOpcKIhEyJgGExc5QwjJdsBiufGi', 124, 'rliefhebbet@gmail.com', 'Platform fighters', 'user');

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `user_team`
--

CREATE TABLE `user_team` (
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `team_id` int(11) NOT NULL,
  `team_role` enum('team_leader','teamate') DEFAULT 'teamate'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Gegevens worden geëxporteerd voor tabel `user_team`
--

INSERT INTO `user_team` (`user_id`, `team_id`, `team_role`) VALUES
(1, 3, 'teamate'),
(2, 15, 'team_leader'),
(4, 16, 'team_leader'),
(11, 3, 'teamate'),
(12, 3, 'team_leader');

--
-- Indexen voor geëxporteerde tabellen
--

--
-- Indexen voor tabel `competitions`
--
ALTER TABLE `competitions`
  ADD PRIMARY KEY (`competition_id`);

--
-- Indexen voor tabel `competition_confirmations`
--
ALTER TABLE `competition_confirmations`
  ADD PRIMARY KEY (`confirmation_id`),
  ADD KEY `competition_id` (`competition_id`),
  ADD KEY `team_id` (`team_id`);

--
-- Indexen voor tabel `competition_results`
--
ALTER TABLE `competition_results`
  ADD PRIMARY KEY (`id`),
  ADD KEY `competition_id` (`competition_id`),
  ADD KEY `winning_team_id` (`winning_team_id`),
  ADD KEY `losing_team_id` (`losing_team_id`),
  ADD KEY `team_id` (`team_id`);

--
-- Indexen voor tabel `competition_teams`
--
ALTER TABLE `competition_teams`
  ADD PRIMARY KEY (`competition_team_id`),
  ADD KEY `competition_id` (`competition_id`),
  ADD KEY `team_id` (`team_id`);

--
-- Indexen voor tabel `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_team` (`user_id`,`team_id`),
  ADD KEY `team_id` (`team_id`);

--
-- Indexen voor tabel `teams`
--
ALTER TABLE `teams`
  ADD PRIMARY KEY (`team_id`);

--
-- Indexen voor tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexen voor tabel `user_team`
--
ALTER TABLE `user_team`
  ADD PRIMARY KEY (`user_id`,`team_id`),
  ADD KEY `team_id` (`team_id`);

--
-- AUTO_INCREMENT voor geëxporteerde tabellen
--

--
-- AUTO_INCREMENT voor een tabel `competitions`
--
ALTER TABLE `competitions`
  MODIFY `competition_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT voor een tabel `competition_confirmations`
--
ALTER TABLE `competition_confirmations`
  MODIFY `confirmation_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT voor een tabel `competition_results`
--
ALTER TABLE `competition_results`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=68;

--
-- AUTO_INCREMENT voor een tabel `competition_teams`
--
ALTER TABLE `competition_teams`
  MODIFY `competition_team_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT voor een tabel `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT voor een tabel `teams`
--
ALTER TABLE `teams`
  MODIFY `team_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT voor een tabel `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- Beperkingen voor geëxporteerde tabellen
--

--
-- Beperkingen voor tabel `competition_confirmations`
--
ALTER TABLE `competition_confirmations`
  ADD CONSTRAINT `competition_confirmations_ibfk_1` FOREIGN KEY (`competition_id`) REFERENCES `competitions` (`competition_id`),
  ADD CONSTRAINT `competition_confirmations_ibfk_2` FOREIGN KEY (`team_id`) REFERENCES `teams` (`team_id`);

--
-- Beperkingen voor tabel `competition_results`
--
ALTER TABLE `competition_results`
  ADD CONSTRAINT `competition_results_ibfk_1` FOREIGN KEY (`competition_id`) REFERENCES `competitions` (`competition_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `competition_results_ibfk_4` FOREIGN KEY (`team_id`) REFERENCES `teams` (`team_id`);

--
-- Beperkingen voor tabel `competition_teams`
--
ALTER TABLE `competition_teams`
  ADD CONSTRAINT `competition_teams_ibfk_1` FOREIGN KEY (`competition_id`) REFERENCES `competitions` (`competition_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `competition_teams_ibfk_2` FOREIGN KEY (`team_id`) REFERENCES `teams` (`team_id`) ON DELETE CASCADE;

--
-- Beperkingen voor tabel `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `notifications_ibfk_2` FOREIGN KEY (`team_id`) REFERENCES `teams` (`team_id`) ON DELETE CASCADE;

--
-- Beperkingen voor tabel `user_team`
--
ALTER TABLE `user_team`
  ADD CONSTRAINT `user_team_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_team_ibfk_2` FOREIGN KEY (`team_id`) REFERENCES `teams` (`team_id`) ON DELETE CASCADE;

DELIMITER $$
--
-- Gebeurtenissen
--
CREATE DEFINER=`root`@`localhost` EVENT `delete_expired_matches` ON SCHEDULE EVERY 1 MINUTE STARTS '2025-01-09 14:26:37' ON COMPLETION NOT PRESERVE ENABLE DO DELETE FROM matches WHERE expiry_time < NOW()$$

CREATE DEFINER=`root`@`localhost` EVENT `delete_competition_5` ON SCHEDULE AT '2025-02-01 12:57:29' ON COMPLETION NOT PRESERVE ENABLE DO BEGIN
                        DELETE FROM competitions WHERE competition_id = 5;
                        DELETE FROM competition_teams WHERE competition_id = 5;
                        DELETE FROM competition_results WHERE competition_id = 5;
                    END$$

DELIMITER ;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
