<!-- connexion.php -->
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>C'chap - Connexion</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="login-container">
        <h1 class="title">C'chap</h1>
        <p class="welcome-text">Bon retour parmi nous !</p>
        <?php if(isset($_GET['error'])): ?>
            <div class="error-message">
                
            </div>
        <?php endif; ?>
        <form method="POST" action="index5.php">
            <div class="form-group">
                <label for="pseudo">Identifiant</label>
                <input type="text" name="pseudo" placeholder="Entrez votre identifiant" required>
            </div>
            <div class="form-group">
                <label for="MDP">Mot de passe</label>
                <input type="password"  name="MDP" placeholder="Entrez votre mot de passe" required>
            </div>
            <div class="form-group">
            <button type="submit" class="submit-btn" name="connexion">envoyez</button>
        </form>
        <div class="links">
            <a href="index6.php">Mot de passe oublié ?</a>
            <a href="index.php">Nouveau ? Créer un compte</a>
        </div>
    </div>
</body>
</html>
