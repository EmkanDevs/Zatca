from io import BytesIO
import base64
import pyqrcode
import frappe

def after_submit(self, method):
    qr_code = frappe.db.get_value("Sales Invoice Additional Fields", {'sales_invoice': self.name}, 'qr_code')
    if not qr_code:
        self.db_set("ksa_einv_qr", "")
        return

    # Create QR code image
    qr = pyqrcode.create(qr_code)
    with BytesIO() as buffer:
        qr.png(buffer, scale=7)
        buffer.seek(0)

        # Save the image as a file in Frappe's File DocType
        file_doc = frappe.get_doc({
            "doctype": "File",
            "file_name": f"{self.name}_ksa_qr.png",
            "is_private": 0,  # 0 = public
            "content": buffer.getvalue(),
            "attached_to_doctype": "Sales Invoice",
            "attached_to_name": self.name
        }).insert(ignore_permissions=True)

        # Set the image file URL to the Attach Image field
        self.db_set("ksa_einv_qr", file_doc.file_url)
