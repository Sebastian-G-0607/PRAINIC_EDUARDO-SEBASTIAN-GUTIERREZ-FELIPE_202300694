CREATE TABLE `catedratico` (
    `id` int NOT NULL AUTO_INCREMENT,
    `nombre` varchar(100) DEFAULT NULL,
    PRIMARY KEY (`id`)
);

CREATE TABLE `curso` (
    `id` int NOT NULL AUTO_INCREMENT,
    `nombre` varchar(100) NOT NULL,
    `seccion` varchar(3) NOT NULL,
    PRIMARY KEY (`id`)
);

CREATE TABLE `curso_catedratico` (
    `id_curso` int NOT NULL,
    `id_catedratico` int NOT NULL,
    PRIMARY KEY (`id_catedratico`,`id_curso`),
    KEY `id_curso` (`id_curso`),
    CONSTRAINT `curso_catedratico_ibfk_1` FOREIGN KEY (`id_curso`) REFERENCES `curso` (`id`) ON DELETE CASCADE,
    CONSTRAINT `curso_catedratico_ibfk_2` FOREIGN KEY (`id_catedratico`) REFERENCES `catedratico` (`id`) ON DELETE CASCADE
);

CREATE TABLE `publicacion` (
    `id` int NOT NULL AUTO_INCREMENT,
    `id_usuario` int NOT NULL,
    `tipo` enum('curso','catedratico') NOT NULL,
    `titulo` varchar(100) NOT NULL,
    `mensaje` varchar(500) NOT NULL,
    `fecha` datetime DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `id_usuario` (`id_usuario`),
    CONSTRAINT `publicacion_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`r_academico`)
);

CREATE TABLE `publicacion_comentario` (
    `id` int NOT NULL AUTO_INCREMENT,
    `id_publicacion` int NOT NULL,
    `id_usuario` int NOT NULL,
    `mensaje` varchar(1000) NOT NULL,
    PRIMARY KEY (`id`),
    KEY `id_publicacion` (`id_publicacion`),
    KEY `id_usuario` (`id_usuario`),
    CONSTRAINT `publicacion_comentario_ibfk_1` FOREIGN KEY (`id_publicacion`) REFERENCES `publicacion` (`id`),
    CONSTRAINT `publicacion_comentario_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`r_academico`)
);

CREATE TABLE `usuario` (
    `r_academico` int NOT NULL,
    `nombres` varchar(75) NOT NULL,
    `apellidos` varchar(75) NOT NULL,
    `contrasenia` varchar(255) NOT NULL,
    `correo` varchar(150) NOT NULL,
    PRIMARY KEY (`r_academico`)
);

CREATE TABLE `usuario_cursos` (
    `id_curso` int NOT NULL,
    `id_usuario` int NOT NULL,
    PRIMARY KEY (`id_usuario`,`id_curso`),
    KEY `id_curso` (`id_curso`),
    CONSTRAINT `usuario_cursos_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`r_academico`) ON DELETE CASCADE,
    CONSTRAINT `usuario_cursos_ibfk_2` FOREIGN KEY (`id_curso`) REFERENCES `curso` (`id`) ON DELETE CASCADE
);