<?php
if(isset($POST['send'])){
	$recipient =$_POST['email'];
	$subject =$_POST['subject'];
	$message =$_POST['message'];	
	
	if(empty($recipient) || empty($subject) || empty($message)){
		?>
			<div class="alert alert-danger text-center">
				<?php echo "All input fields are required!"?>
			</div>
		<?php
	}
}

?>
if(mail($receiver, $subject, $body, $sender)) {
	echo "Email sent successfully to $receiver";
}else{
	echo "Sorry, failed while sending mail!";
}