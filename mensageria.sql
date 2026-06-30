-- =====================================================================
-- Projeto de Banco de Dados - Mensageria (WhatsApp)
-- Banco de Dados I - UNIVALI
-- SGBD: MySQL 8.x
-- =====================================================================

-- ---------------------------------------------------------------------
-- Criacao do schema
-- ---------------------------------------------------------------------
DROP DATABASE IF EXISTS mensageria;
CREATE DATABASE mensageria
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;
USE mensageria;

CREATE TABLE usuario (
    id                BIGINT       NOT NULL AUTO_INCREMENT,
    telefone          VARCHAR(20)  NOT NULL,
    nome_exibicao     VARCHAR(100) NOT NULL,
    status_recado     VARCHAR(150) NULL,
    foto_url          VARCHAR(255) NULL,
    ultima_vez_online DATETIME     NULL,
    criado_em         DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_usuario PRIMARY KEY (id),
    CONSTRAINT uq_usuario_telefone UNIQUE (telefone)
) ENGINE=InnoDB;

CREATE TABLE chat (
    id        BIGINT       NOT NULL AUTO_INCREMENT,
    tipo      VARCHAR(15)  NOT NULL,
    nome      VARCHAR(100) NULL,
    descricao VARCHAR(255) NULL,
    criado_em DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_chat PRIMARY KEY (id),
    CONSTRAINT ck_chat_tipo CHECK (tipo IN ('individual', 'grupo'))
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- Tabela: chat_participante
-- Resolve o N:N entre usuario e chat (entidade associativa).
-- PK composta garante um unico vinculo por par (chat, usuario).
-- saiu_em nulo = participante ainda ativo no chat.
-- ---------------------------------------------------------------------
CREATE TABLE chat_participante (
    chat_id    BIGINT      NOT NULL,
    usuario_id BIGINT      NOT NULL,
    papel      VARCHAR(15) NOT NULL DEFAULT 'membro',
    entrou_em  DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    saiu_em    DATETIME    NULL,
    CONSTRAINT pk_chat_participante PRIMARY KEY (chat_id, usuario_id),
    CONSTRAINT fk_cp_chat
        FOREIGN KEY (chat_id)    REFERENCES chat(id)    ON DELETE CASCADE,
    CONSTRAINT fk_cp_usuario
        FOREIGN KEY (usuario_id) REFERENCES usuario(id) ON DELETE CASCADE,
    CONSTRAINT ck_cp_papel CHECK (papel IN ('membro', 'admin'))
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- Tabela: mensagem
-- Cada mensagem pertence a um chat (contem) e tem um remetente (envia).
-- respondendo_msg_id: auto-relacionamento para o recurso "responder".
-- deletada_em nulo = mensagem visivel.
-- ---------------------------------------------------------------------
CREATE TABLE mensagem (
    id                BIGINT       NOT NULL AUTO_INCREMENT,
    chat_id           BIGINT       NOT NULL,
    remetente_id      BIGINT       NOT NULL,
    conteudo          TEXT         NOT NULL,
    tipo_conteudo     VARCHAR(15)  NOT NULL DEFAULT 'texto',
    respondendo_msg_id BIGINT      NULL,
    enviada_em        DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deletada_em       DATETIME     NULL,
    CONSTRAINT pk_mensagem PRIMARY KEY (id),
    CONSTRAINT fk_msg_chat
        FOREIGN KEY (chat_id)      REFERENCES chat(id)     ON DELETE CASCADE,
    CONSTRAINT fk_msg_remetente
        FOREIGN KEY (remetente_id) REFERENCES usuario(id),
    CONSTRAINT fk_msg_resposta
        FOREIGN KEY (respondendo_msg_id) REFERENCES mensagem(id),
    CONSTRAINT ck_msg_tipo
        CHECK (tipo_conteudo IN ('texto', 'imagem', 'audio', 'video'))
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- Tabela: mensagem_status
-- Entidade associativa que registra o status (enviado/entregue/lido)
-- de cada mensagem para cada destinatario.
-- PK composta garante um unico status por par (mensagem, usuario).
-- ---------------------------------------------------------------------
CREATE TABLE mensagem_status (
    mensagem_id   BIGINT      NOT NULL,
    usuario_id    BIGINT      NOT NULL,
    status        VARCHAR(15) NOT NULL DEFAULT 'enviado',
    atualizado_em DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP
                                       ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT pk_mensagem_status PRIMARY KEY (mensagem_id, usuario_id),
    CONSTRAINT fk_ms_mensagem
        FOREIGN KEY (mensagem_id) REFERENCES mensagem(id) ON DELETE CASCADE,
    CONSTRAINT fk_ms_usuario
        FOREIGN KEY (usuario_id)  REFERENCES usuario(id)  ON DELETE CASCADE,
    CONSTRAINT ck_ms_status
        CHECK (status IN ('enviado', 'entregue', 'lido'))
) ENGINE=InnoDB;

-- =====================================================================
-- POPULACAO DAS TABELAS (dados de exemplo)
-- =====================================================================

-- ---------------------------------------------------------------------
-- Usuarios
-- ---------------------------------------------------------------------
INSERT INTO usuario (telefone, nome_exibicao, status_recado, foto_url, ultima_vez_online) VALUES
('+5547999990001', 'Gabriel',  'Disponivel',        'https://cdn.exemplo.com/u/gabriel.jpg', '2026-06-14 18:30:00'),
('+5547999990002', 'Mariana',  'Ocupada',           'https://cdn.exemplo.com/u/mariana.jpg', '2026-06-14 18:25:00'),
('+5547999990003', 'Pedro',    'No trabalho',       NULL,                                    '2026-06-14 17:50:00'),
('+5547999990004', 'Joao',     'Disponivel',        'https://cdn.exemplo.com/u/joao.jpg',    '2026-06-14 18:10:00'),
('+5547999990005', 'Beatriz',  'Surfando',          NULL,                                    '2026-06-14 16:40:00');

-- ---------------------------------------------------------------------
-- Chats (2 individuais e 1 grupo)
-- ---------------------------------------------------------------------
INSERT INTO chat (tipo, nome, descricao) VALUES
('individual', NULL,             NULL),
('individual', NULL,             NULL),
('grupo',      'Trabalho de BD', 'Grupo do trabalho de Banco de Dados');

-- ---------------------------------------------------------------------
-- Participantes
-- Chat 1 (individual): Gabriel + Mariana
-- Chat 2 (individual): Gabriel + Pedro
-- Chat 3 (grupo): Gabriel (admin) + Mariana + Joao + Beatriz
-- ---------------------------------------------------------------------
INSERT INTO chat_participante (chat_id, usuario_id, papel) VALUES
(1, 1, 'membro'),
(1, 2, 'membro'),
(2, 1, 'membro'),
(2, 3, 'membro'),
(3, 1, 'admin'),
(3, 2, 'membro'),
(3, 4, 'membro'),
(3, 5, 'membro');

-- ---------------------------------------------------------------------
-- Mensagens
-- ---------------------------------------------------------------------
INSERT INTO mensagem (chat_id, remetente_id, conteudo, tipo_conteudo, respondendo_msg_id) VALUES
(1, 1, 'Oi Mariana, tudo bem?',                'texto',  NULL),  -- msg 1
(1, 2, 'Tudo otimo! E voce?',                  'texto',  1),     -- msg 2 (responde a 1)
(2, 1, 'Pedro, terminou a parte do SQL?',      'texto',  NULL),  -- msg 3
(2, 3, 'Quase, falta popular as tabelas',      'texto',  3),     -- msg 4 (responde a 3)
(3, 1, 'Pessoal, subi o diagrama no grupo',    'texto',  NULL),  -- msg 5
(3, 4, 'Show, vou revisar agora',              'texto',  5),     -- msg 6 (responde a 5)
(3, 5, 'Foto do quadro com as cardinalidades', 'imagem', NULL);  -- msg 7

-- ---------------------------------------------------------------------
-- Status das mensagens (um registro por destinatario, exceto o remetente)
-- ---------------------------------------------------------------------
-- Msg 1 (Gabriel -> chat 1): destinatario Mariana
INSERT INTO mensagem_status (mensagem_id, usuario_id, status) VALUES
(1, 2, 'lido'),
-- Msg 2 (Mariana -> chat 1): destinatario Gabriel
(2, 1, 'lido'),
-- Msg 3 (Gabriel -> chat 2): destinatario Pedro
(3, 3, 'entregue'),
-- Msg 4 (Pedro -> chat 2): destinatario Gabriel
(4, 1, 'lido'),
-- Msg 5 (Gabriel -> grupo 3): destinatarios Mariana, Joao, Beatriz
(5, 2, 'lido'),
(5, 4, 'lido'),
(5, 5, 'entregue'),
-- Msg 6 (Joao -> grupo 3): destinatarios Gabriel, Mariana, Beatriz
(6, 1, 'lido'),
(6, 2, 'entregue'),
(6, 5, 'enviado'),
-- Msg 7 (Beatriz -> grupo 3): destinatarios Gabriel, Mariana, Joao
(7, 1, 'entregue'),
(7, 2, 'enviado'),
(7, 4, 'enviado');

-- =====================================================================
-- CONSULTAS DE VERIFICACAO (opcional - para conferir a carga)
-- =====================================================================
-- SELECT * FROM usuario;
-- SELECT * FROM chat;
-- SELECT * FROM chat_participante;
-- SELECT * FROM mensagem;
-- SELECT * FROM mensagem_status;
