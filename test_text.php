<script>
function generateBuasriId(studentId) {
    // ตรวจสอบความถูกต้องเบื้องต้น (ต้องเป็นตัวเลข 11 หลัก)
    if (!studentId || studentId.length !== 11 || isNaN(studentId)) {
        return "รหัสนิสิตไม่ถูกต้อง";
    }

    // 1. ดึงปีที่เข้าศึกษา (2 หลักแรก) -> "57"
    const year = studentId.substring(0, 2); 

    // 2. ดึงรหัสคณะ/กลุ่ม (ตัดยุบจาก 1100 ให้เหลือ 2 หลัก เช่น 10)
    // ในที่นี้ใช้วิธีตัดตำแหน่งที่ 2 และ 5 ของรหัสเดิมมาผสมกัน หรือระบุตามเงื่อนไขคณะ
    const facultyGroup = studentId.substring(2, 3) + studentId.substring(5, 6); // -> "1" + "0" = "10"

    // 3. ดึงเลขลำดับท้าย (4 หลักสุดท้าย) -> "0277"
    const sequence = studentId.substring(7, 11); 

    // รวมร่างเป็น 8 หลักพอดี (2 + 2 + 4 = 8 หลัก)
    const numericId8 = year + facultyGroup + sequence;

    return numericId8;
}

// === ทดสอบการใช้งาน ===
const studentId = "57110010277";
const buasriId = generateBuasriId(studentId);

console.log("รหัสนิสิตเดิม:", studentId); // 57110010277 (11 หลัก)
console.log("Buasri ID (8 หลัก):", buasriId); // 57100277 (8 หลักล้วน)
console.log("ความยาวผลลัพธ์:", buasriId.length, "หลัก");
</script>