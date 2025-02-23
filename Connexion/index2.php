<?php
session_start();

try {
    // Connexion à la base de données
    $clspit = new PDO("mysql:host=localhost;dbname=wh100255_users;charset=utf8", 'wh100255_users', 'JnBWzvKMydIy');
    $clspit->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Erreur de connexion : " . $e->getMessage());
}



$message_error1 = $message_error2 = "";

if (isset($_POST['envoyer'])) {
    if (!empty($_POST['pseudo']) && !empty($_POST['MDP'])) {

        $pseudo = htmlspecialchars(trim($_POST['pseudo']));
        $MDP = password_hash(trim($_POST['MDP']), PASSWORD_DEFAULT); // Hash sécurisé

        // Vérifier si l'utilisateur existe déjà
        $CheckUser = $clspit->prepare("SELECT * FROM users123 WHERE pseudo = ?");
        $CheckUser->execute([$pseudo]);

        if ($CheckUser->rowCount() > 0) {
           echo $message_error1 = "Ce nom d'utilisateur est déjà pris.";
        } else {
            // Insérer l'utilisateur
            $InsertUser = $clspit->prepare("INSERT INTO users123 (pseudo, MDP) VALUES (?, ?)");
            if ($InsertUser->execute([$pseudo, $MDP])) {
                header('Location: index4.php?');
                exit();
            } else {
               echo $message_error1 = "Erreur lors de l'inscription.";
            }
        }
    } else {
        $message_error2 = "Veuillez remplir tous les champs.";
    }
}
?>