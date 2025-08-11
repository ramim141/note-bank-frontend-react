// src/pages/Notes/EditNotePage.jsx
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ProtectedRoute from '../../routes/ProtectedRoute'
import NoteForm from '../../components/notes/NoteForm'
import { useAuth } from '../../context/useAuth'
import { noteService } from '../../api/apiService/noteService'
import { toast } from 'react-toastify'

const EditNotePage = () => {
  const { noteId } = useParams()
  const { token } = useAuth()
  const navigate = useNavigate()
  const [initialData, setInitialData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const data = await noteService.getNoteById(noteId, token)
        setInitialData({
          title: data.title,
          description: data.description || '',
          category: data.category || '',
          course: data.course || '',
          department: data.department || '',
          faculty: data.faculty || '',
          semester: data.semester || '',
          tags: Array.isArray(data.tags) ? data.tags : [],
        })
      } catch (e) {
        console.error(e)
        toast.error(e?.detail || e?.message || 'Failed to load note.')
        navigate('/my-notes')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [noteId, token, navigate])

  const handleUpdate = async (formDataToSend) => {
    try {
      // Use PATCH with FormData to allow optional file replacement
      await noteService.updateNote(noteId, formDataToSend, token, true)
      toast.success('Note updated successfully')
      navigate('/my-notes')
    } catch (e) {
      console.error(e)
      throw e
    }
  }

  if (loading) return null
  if (!initialData) return null

  return (
    <ProtectedRoute>
      <div className="mx-auto">
        <NoteForm initialData={initialData} onUploadSuccess={handleUpdate} mode="edit" />
      </div>
    </ProtectedRoute>
  )
}

export default EditNotePage


