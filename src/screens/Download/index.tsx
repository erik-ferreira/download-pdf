import { useState } from "react"
import * as Sharing from "expo-sharing"
import * as FileSystem from "expo-file-system"
import { Alert, Platform, Text, View } from "react-native"

import { Button } from "../../components/Button"

import { styles } from "./styles"

const PDF_URI = {
  SAMPLE: "https://www.thecampusqdl.com/uploads/files/pdf_sample_2.pdf",
  FLORI: "https://www.mcfadden.com.br/assets/pdf/Flofi.pdf",
}

const PDF_NAME = "doc.pdf"

export function Download() {
  const [downloading, setDownloading] = useState(false)
  const [percentage, setPercentagem] = useState(0)

  function onDownloadProgress({
    totalBytesWritten,
    totalBytesExpectedToWrite,
  }: FileSystem.DownloadProgressData) {
    const percentagemDownload =
      (totalBytesWritten / totalBytesExpectedToWrite) * 100

    setPercentagem(percentagemDownload)
  }

  async function onSaveFile(uri: string, filename: string) {
    if (Platform.OS === "android") {
      // Pega a pasta temporária.
      const directoryUri = FileSystem.cacheDirectory + filename

      // Lê o conteúdo do arquivo em formato base64
      const base64File = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      })

      // Escreve o conteúdo do arquivo no diretório.
      await FileSystem.writeAsStringAsync(directoryUri, base64File, {
        encoding: FileSystem.EncodingType.Base64,
      })

      // Abre o arquivo recém-criado
      await Sharing.shareAsync(directoryUri)
    } else {
      Sharing.shareAsync(uri)
    }
  }

  async function handleDownloadPDF() {
    try {
      setDownloading(true)

      const fileUri = FileSystem.documentDirectory + PDF_NAME
      const downloadResumable = FileSystem.createDownloadResumable(
        PDF_URI.FLORI,
        fileUri,
        {},
        onDownloadProgress
      )

      const downloadResponse = await downloadResumable.downloadAsync()

      if (downloadResponse?.uri) {
        onSaveFile(downloadResponse.uri, PDF_NAME)
      }
    } catch (error) {
      Alert.alert("Download", "Não foi possível fazer o download")
      console.error(error)
    } finally {
      setDownloading(false)
      setPercentagem(0)
    }
  }

  return (
    <View style={styles.container}>
      <Button title="Download PDF" onPress={handleDownloadPDF} />

      {percentage > 0 && (
        <Text style={styles.progress}>{percentage.toFixed(1)}%</Text>
      )}
    </View>
  )
}
