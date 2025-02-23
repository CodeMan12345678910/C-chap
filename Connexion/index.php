<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>C'chap - Inscription</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="login-container">
        <h1 class="logo">C'chap</h1>
        <form method="POST" action="index2.php">
            <div class="form-group">
                <label for="pseudo">Nom d'utilisateur</label>
                <input type="text"  name="pseudo" placeholder="Entrez votre nom d'utilisateur" required>
            </div>
            <div class="form-group">
                <label for="MDP">Mot de passe</label>
                <input type="password" name="MDP" placeholder="Entrez votre mot de passe" required>
            </div>
            <button type="submit" class="submit-btn" name="envoyer">S'inscrire</button>
        </form>
        <div class="links">
            <a href="index4.php">Déjà inscrit ? Se connecter</a>
        </div>
    </div>
</body>
</html>