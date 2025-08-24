import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoImage: {
    width: 180,
    height: 30,
    marginRight: 5,
  },
  appointmentInfo: {
    textAlign: 'right',
  },
  appointmentText: {
    fontSize: 10,
    color: '#555555',
  },
  dateText: {
    fontSize: 10,
    color: '#007bff',
    marginTop: 2,
  },
  section: {
    marginBottom: 15,
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333333',
  },
  subSectionHeading: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333333',
  },
  itemText: {
    fontSize: 10,
    marginBottom: 4,
    color: '#444444',
  },
  table: {
    display: 'table',
    width: 'auto',
    marginBottom: 10,
    borderStyle: 'solid',
    borderColor: '#bfbfbf',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row',
  },
  tableColHeader: {
    width: '33.33%',
    borderStyle: 'solid',
    borderColor: '#bfbfbf',
    borderBottomWidth: 1,
    borderRightWidth: 1,
    padding: 5,
    backgroundColor: '#f2f2f2',
  },
  tableCol: {
    width: '33.33%',
    borderStyle: 'solid',
    borderColor: '#bfbfbf',
    borderBottomWidth: 1,
    borderRightWidth: 1,
    padding: 5,
  },
  tableCellHeader: {
    margin: 'auto',
    fontSize: 10,
    fontWeight: 'bold',
    color: '#333333',
  },
  tableCell: {
    margin: 'auto',
    fontSize: 9,
    color: '#444444',
  },
  policySection: {
    marginTop: 30,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    paddingTop: 15,
  },
  policyHeading: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333333',
  },
  policyText: {
    fontSize: 9,
    lineHeight: 1.5,
    color: '#666666',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'right',
    fontSize: 8,
    color: '#888888',
  },
  digitalSignature: {
    position: 'absolute',
    bottom: 60,
    right: 30,
    textAlign: 'right',
    fontSize: 9,
    color: '#333333',
  },
  signatureText: {
    fontSize: 9,
    color: '#333333',
    marginBottom: 2,
  },
});

const MedicalSummaryPDF = ({
  prescribedDrugs,
  selectedLabTests,
  type,
  patientName,
  patientId,
  doctorFirstName,
  doctorLastName,
}) => {
  const doctorName =
    doctorFirstName && doctorLastName
      ? `Dr. ${doctorFirstName} ${doctorLastName}`
      : doctorFirstName
        ? `Dr. ${doctorFirstName} Smith`
        : 'Dr. John Smith';

  const currentDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image src="/images/navbarLogo.png" style={styles.logoImage} />
          </View>
          <View style={styles.appointmentInfo}>
            <Text style={styles.appointmentText}>Appointment: --</Text>
            <Text style={styles.dateText}>
              Date: {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionHeading}>Patient Information:</Text>
          <Text style={styles.itemText}>Name: {patientName || 'N/A'}</Text>
          <Text style={styles.itemText}>Patient ID: {patientId || 'N/A'}</Text>
        </View>

        {/* Chief Complaints */}
        <View style={styles.section}>
          <Text style={styles.sectionHeading}>Chief Complaints:</Text>
          <Text style={styles.itemText}>
            Patient reports worsening persistent headache over the past 3 days, primarily frontal and temporal, rated
            7/10 at its peak. Reports a throbbing sensation, aggravated by light and sound.
          </Text>
        </View>

        {/* Medical History */}
        <View style={styles.section}>
          <Text style={styles.sectionHeading}>Medical History:</Text>
          <Text style={styles.itemText}>Medical History: none</Text>
          <Text style={styles.itemText}>Allergies: none</Text>
        </View>

        {type === 'prescriptions' && (
          <View style={styles.section}>
            <Text style={styles.sectionHeading}>Prescribed Medications:</Text>
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCellHeader}>Prescription</Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCellHeader}>Notes</Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCellHeader}>Details</Text>
                </View>
              </View>
              {prescribedDrugs.length > 0 ? (
                prescribedDrugs.map((drug, index) => (
                  <View style={styles.tableRow} key={index}>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>
                        {drug.name} ({drug.type})
                      </Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>{drug.notes || '--'}</Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>
                        {drug.dosage}, {drug.frequency}, {drug.route}, {drug.duration}
                      </Text>
                    </View>
                  </View>
                ))
              ) : (
                <View style={styles.tableRow}>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>No medications prescribed.</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>--</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>--</Text>
                  </View>
                </View>
              )}
            </View>
          </View>
        )}

        {type === 'lab-results' && (
          <View style={styles.section}>
            <Text style={styles.sectionHeading}>Lab Orders:</Text>
            {selectedLabTests.length > 0 ? (
              selectedLabTests.map((test, index) => (
                <Text key={index} style={styles.itemText}>
                  • {test}
                </Text>
              ))
            ) : (
              <Text style={styles.itemText}>No lab tests ordered.</Text>
            )}
          </View>
        )}

        {/* Follow-up Date */}
        <View style={styles.section}>
          <Text style={styles.subSectionHeading}>Follow-up Date:</Text>
          <Text style={styles.itemText}>
            {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} 3:25 PM
          </Text>
        </View>

        <View style={styles.policySection}>
          <Text style={styles.policyText}>
            All patients must carry a valid photo ID. Claims must be submitted within 30 days of treatment.
            Pre-authorization required for planned procedures. Emergency cases must be reported within 24 hours.
            Incomplete forms may delay processing. Policies may change without notice.
          </Text>
        </View>

        <View style={styles.digitalSignature}>
          <Text style={styles.signatureText}>Digitally Signed by: {doctorName}</Text>
          <Text style={styles.signatureText}>Date: {currentDate}</Text>
        </View>

        <Text style={styles.footer}>Generated by UhuruMed</Text>
      </Page>
    </Document>
  );
};

export default MedicalSummaryPDF;
