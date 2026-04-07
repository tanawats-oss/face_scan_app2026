<?php
/*
==================================================
System      : Face Recognition Registration System
Developer   : นายธนวัฒน์ เสริฐสุวรรณกุล
Position    : นักวิชาการคอมพิวเตอร์
Unit        : งานเทคโนโลยีวิทยทรัพยากรดิจิทัล
Email       : tanawats@g.swu.ac.th
Developed   : 2025
==================================================
*/
?>
<?php
session_start();
session_destroy();
header("Location: login.php");
exit;
?>