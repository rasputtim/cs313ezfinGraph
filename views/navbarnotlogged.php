<div class="navbar navbar_">
	<div class="navbar-inner navbar-inner_">
		
		<div class="nav-collapse nav-collapse_ collapse">
			<ul class="nav sf-menu clearfix">
      <li><a href="index.php">Home</a></li>
      <li class="<?php echo $index1_active; ?> "><a href="aboutus.php">About Us</a></li>
				
				<li class="<?php echo $index5_active; ?>" ><a href="contacts.php">Contacts</a></li>	
				<li class="<?php echo $index5_active; ?>" >
					<form class="my-form-login" action="login.php" method="post">
						<div id="username" class="form-group <?php echo (!empty($username_err)) ? 'has-error' : ''; ?>">
							<input type="text" name="username" class="form-control form-control-sm" value="<?php echo $username; ?>" placeholder = "username = admin">
							<span class="help-block"><?php echo $username_err; ?></span>
						</div>    
						<div class="form-group <?php echo (!empty($password_err)) ? 'has-error' : ''; ?>">
							<input type="password" name="password" class="form-control form-control-sm" placeholder = "password = 123456" required>
							<span class="help-block"><?php echo $password_err; ?></span>
						</div>
				</li>
				<li class="<?php echo $index5_active; ?>" >	
						<div class="form-group">
							<input type="submit" class="btn btn-primary" value="Login">
						</div>
						<p><a href="register.php">Sign up now</a>.</p>
					</form>
				</li>


    </ul>
		</div>
	</div>
</div>