import { View } from "react-native"

import { Button } from "../../components/Button"

import { styles } from "./styles"

const PDF_URI = {
  SAMPLE: "https://www.thecampusqdl.com/uploads/files/pdf_sample_2.pdf",
  FLORI: "https://www.mcfadden.com.br/assets/pdf/Flofi.pdf",
}

export function Download() {
  return (
    <View style={styles.container}>
      <Button title="Download PDF" />
    </View>
  )
}
