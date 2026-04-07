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
$user_login     = "tanawats";   // $_REQUEST["user_login"];
$user_password  = "Lordpooh@2534";    // $_REQUEST["user_password"];

// กำหนด RDN ของผู้ใช้ (ขึ้นอยู่กับโครงสร้าง LDAP จริงของ SWU)
// ถ้าโครงสร้างเป็น uid=xxxx,dc=swu,dc=ac,dc=th
$ldaprdn = "uid={$user_login},dc=swu,dc=ac,dc=th";

// เชื่อมต่อ LDAP Server
$ldapconn = ldap_connect("ldap://ldap.swu.ac.th") or die("Could not connect to LDAP server.");

// ตั้งค่า protocol
ldap_set_option($ldapconn, LDAP_OPT_PROTOCOL_VERSION, 3);

// พยายาม bind ด้วย user/password
if (@ldap_bind($ldapconn, $ldaprdn, $user_password)) {
    echo "✅ Login success for user: " . $user_login;
    // สร้าง session ได้ที่นี่
    session_start();
    $_SESSION['user_login'] = $user_login;
} else {
    echo "❌ Login failed for user: " . $user_login;
}
?>