-- --------------------------------------------------------
#CRIAÇÃO DO BANCO DE DADOS
CREATE DATABASE linense;

-- --------------------------------------------------------
#UTILIZANDO-O
USE linense;

-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS adm(
    id_adm INT NOT NULL AUTO_INCREMENT,
    user_adm VARCHAR(20) NOT NULL,
    senha_adm VARCHAR(255) NOT NULL,
    email_adm VARCHAR(255) NOT NULL,
    token VARCHAR(255) DEFAULT NULL,
    expiry_date DATETIME DEFAULT NULL,
    PRIMARY KEY (id_adm)
)
ENGINE=INNODB;


CREATE TABLE IF NOT EXISTS staff (
    id_staff INT NOT NULL AUTO_INCREMENT,
    nome_staff VARCHAR(255) NOT NULL,
    setor ENUM('Administrativo', 'Recursos Humanos', 'Gestao Financeira', 'Compras', 'Tecnologia da Informação', 'Marketing', 'Executivo de Futebol') NOT NULL,
    funcao ENUM('Presidente', 'Diretor de Recursos Humanos', 'Gerente de Recursos Humanos', 'Especialista em Recrutamento', 'Analista de Remuneração e Benefícios', 'Coordenador de Treinamento e Desenvolvimento', 'Assistente de RH', 'Analista de Relações Trabalhistas', 'Especialista em Cultura Organizacional', 'Diretor Financeiro (CFO)', 'Controlador Financeiro', 'Gerente de Contabilidade', 'Analista Financeiro', 'Controller de Custos', 'Especialista em Planejamento Financeiro', 'Gerente de Tesouraria', 'Analista de Crédito e Cobrança', 'Diretor de Compras', 'Gerente de Suprimentos', 'Analista de Compras', 'Coordenador de Logística', 'Especialista em Negociação', 'Analista de Estoques', 'Comprador Sênior', 'Assistente de Compras', 'Diretor de TI', 'Gerente de Infraestrutura de TI', 'Administrador de Banco de Dados', 'Especialista em Segurança Cibernética', 'Analista de Suporte Técnico', 'Desenvolvedor de Software', 'Administrador de Redes', 'Especialista em Gerenciamento de Projetos de TI', 'Diretor de Marketing', 'Gerente de Marketing', 'Especialista em Mídias Sociais', 'Analista de Pesquisa de Mercado', 'Gestor de Publicidade', 'Coordenador de Eventos', 'Designer Gráfico', 'Especialista em Marketing Digital', 'Diretor de Futebol', 'Gerente de Futebol', 'Técnico de Futebol', 'Treinador de Futebol', 'Analista de Desempenho', 'Preparador Físico', 'Assistente Técnico', 'Coordenador de Categorias de Base') NOT NULL,
    id_imagem INT DEFAULT NULL,
    PRIMARY KEY (id_staff)
)  
ENGINE=INNODB;


CREATE TABLE IF NOT EXISTS elenco (
    id_elenco INT NOT NULL AUTO_INCREMENT,
    nome_jogador VARCHAR(255) NOT NULL,
    numero_camisa INT NOT NULL,
    posicao ENUM('Goleiro', 'Zagueiro', 'Lateral', 'Meia', 'Atacante') NOT NULL,
    data_nasc DATE NOT NULL,
    idade INT NOT NULL,
    altura DOUBLE NOT NULL,
    nacionalidade VARCHAR(100) NOT NULL,
    descricao TEXT NOT NULL,
    id_imagem INT DEFAULT NULL,
    PRIMARY KEY (id_elenco)
)  
ENGINE=INNODB;


CREATE TABLE IF NOT EXISTS imagens (
    id_imagem INT NOT NULL AUTO_INCREMENT,
    titulo_imagem VARCHAR(50) NOT NULL,
    categoria ENUM('elenco', 'staff', 'patrocinador', 'parceiro', 'noticias') NOT NULL,
    path VARCHAR(255) NOT NULL,
    descricao_imagem TEXT NOT NULL,
    data_criacao DATETIME NOT NULL,
		INDEX (idx_titulo_imagem),
    PRIMARY KEY (id_imagem)
)  
ENGINE=INNODB;


CREATE TABLE IF NOT EXISTS pacote (
    id_pacote INT NOT NULL AUTO_INCREMENT,
    tipo_pacote ENUM('basico', 'intermediario', 'avancado') NOT NULL,
    descricao_pacote VARCHAR(100) NOT NULL,
    PRIMARY KEY (id_pacote)
) 
ENGINE=INNODB;


CREATE TABLE IF NOT EXISTS socio_torcedor (
    id_socio_torcedor INT NOT NULL AUTO_INCREMENT,
    nome VARCHAR(255) NOT NULL,
    data_nasc DATE NOT NULL,
    cpf VARCHAR(11) UNIQUE NOT NULL,
    email_st VARCHAR(255) NOT NULL,
    senha_st VARCHAR(60) NOT NULL,
    telefone VARCHAR(11) NOT NULL,
    id_pacote INT NOT NULL,
    INDEX (idx_id_pacote),
    CONSTRAINT fk_id_pacote FOREIGN KEY (id_pacote)
        REFERENCES pacote (id_pacote),
    PRIMARY KEY (id_socio_torcedor)
) 
ENGINE=INNODB;


CREATE TABLE IF NOT EXISTS patrocinador (
    id_patrocinador INT NOT NULL AUTO_INCREMENT,
    nome_patrocinador VARCHAR(50) NOT NULL,
    link VARCHAR(255) NOT NULL,
    id_imagem INT DEFAULT NULL,
    PRIMARY KEY (id_patrocinador)
) 
ENGINE=INNODB;


CREATE TABLE IF NOT EXISTS parceiro (
    id_parceiro INT NOT NULL AUTO_INCREMENT,
    nome_parceiro VARCHAR(50) NOT NULL,
    link VARCHAR(50) NOT NULL,
    id_imagem INT DEFAULT NULL,
    PRIMARY KEY (id_parceiro)
) 
ENGINE=INNODB;


CREATE TABLE IF NOT EXISTS noticias (
    id_noticia INT NOT NULL AUTO_INCREMENT,
    nome_materia VARCHAR(150) NOT NULL,
    descricao_materia TEXT NOT NULL,
    data_criacao DATETIME NOT NULL,
    id_imagem INT DEFAULT NULL,
        INDEX (idx_nome_materia),
    PRIMARY KEY (id_noticia)
) 
ENGINE=INNODB;

-- --------------------------------------------------------