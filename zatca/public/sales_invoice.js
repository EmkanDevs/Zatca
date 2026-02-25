frappe.ui.form.on('Sales Invoice', {

    refresh: function (frm) {

        if (frm.doc.docstatus === 1) {  // optional condition

            let btn = frm.add_custom_button(__('Zatca PDF/XML'), async function () {

                let res = await frappe.db.get_value(
                    'Sales Invoice Additional Fields',
                    { sales_invoice: frm.doc.name },
                    'name'
                );

                if (!res.message) {
                    frappe.msgprint(__('Sales Invoice Additional Fields not found'));
                    return;
                }

                let siaf_name = res.message.name;

                await frappe.call({
                    method: 'ksa_compliance.ksa_compliance.doctype.sales_invoice_additional_fields.sales_invoice_additional_fields.check_pdf_a3b_support',
                    args: {
                        id: siaf_name,
                    }
                });

                let fields = [
                    {
                        label: 'Print Format',
                        fieldname: 'print_format',
                        fieldtype: 'Link',
                        options: 'Print Format',
                        reqd: 1,
                    },
                    {
                        label: 'Language',
                        fieldname: 'lang',
                        fieldtype: 'Link',
                        options: 'Language',
                        default: 'en',
                        reqd: 1,
                    }
                ];

                frappe.prompt(fields, values => {
                    window.location.assign(
                        "/api/method/ksa_compliance.ksa_compliance.doctype.sales_invoice_additional_fields.sales_invoice_additional_fields.download_zatca_pdf" +
                        "?id=" + siaf_name +
                        "&print_format=" + values.print_format +
                        "&lang=" + values.lang
                    );
                });

            });

            // 🔵 Add Color (Bootstrap classes)
            $(btn).removeClass('btn-default').addClass('btn-success');
            // Other options:
            // $(btn).addClass('btn-success'); // Green.
            // $(btn).addClass('btn-danger');  // Red
            // $(btn).addClass('btn-warning'); // Yellow
        }
    }

});