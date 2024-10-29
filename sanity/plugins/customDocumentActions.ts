import {definePlugin} from 'sanity'
import {type DocumentActionComponent} from 'sanity'
import client from '../lib/client'


// Custom delete action that allows deletion for all documents
const DeleteAction: DocumentActionComponent = (props) => {
  const {draft, published, onComplete} = props

  if (!draft && !published) return null

  return {
    label: 'Delete',
    tone: 'critical',
    onHandle: async () => {
      // Perform delete
    //   const client = props.getClient({apiVersion: '2024-04-09'})
      
      // Delete both draft and published versions if they exist
      const transactions = []
      if (published?._id) {
        transactions.push(client.delete(published._id))
      }
      if (draft?._id) {
        transactions.push(client.delete(draft._id))
      }

      await Promise.all(transactions)
      onComplete()
    },
    title: 'Delete document',
    icon: () => '🗑️', // You can use a custom icon component here
  }
}

// Plugin that adds the delete action
export const customDocumentActionsPlugin = definePlugin({
  name: 'custom-document-actions',
  document: {
    actions: (prev) => {
      // Replace the default delete action with our custom one
      return prev.map((prevAction) => 
        prevAction.action === 'delete' ? DeleteAction : prevAction
      )
    }
  }
}) 