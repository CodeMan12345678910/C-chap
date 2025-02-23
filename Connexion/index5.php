<?php
session_start();

try {
    // Connexion à la base de données
    $clspit = new PDO("mysql:host=localhost;dbname=wh100255_users;charset=utf8", 'wh100255_users', 'JnBWzvKMydIy');
    $clspit->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Erreur de connexion : " . $e->getMessage());
}

$message_error = "";
$message_success = "";

if (isset($_POST['connexion'])) {
    if (!empty($_POST['pseudo']) && !empty($_POST['MDP'])) {

        $pseudo = htmlspecialchars(trim($_POST['pseudo']));
        $MDP = trim($_POST['MDP']); // Ne pas hasher ici !

        // Vérifier si l'utilisateur existe
        $CheckUser = $clspit->prepare("SELECT * FROM users123 WHERE pseudo = ?");
        $CheckUser->execute([$pseudo]);

        if ($CheckUser->rowCount() > 0) {
            $UserInfo = $CheckUser->fetch();

            // Vérifier le mot de passe avec password_verify()
            if (password_verify($MDP, $UserInfo['MDP'])) {
                $_SESSION['pseudo'] = $UserInfo['pseudo'];
                $_SESSION['user_id'] = $UserInfo['id']; // Stocker l'ID utilisateur

                header("Location: home.php"); // Redirection après connexion
                exit();
            } else {
                  $message_error = "Mot de passe incorrect.";
                  header('location: index4.php');
            }
        } else {
              $message_error = "Aucun compte trouvé avec ce pseudo.";
              header('location: index4.php');
        }
    } else {
        $message_error = "Veuillez remplir tous les champs.";
        header('location: index4.php');
    }
}
?>