"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { Plus, Search, Check, Clock, Pencil, Trash2, ArrowLeft, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { todoApi } from "@/lib/todoApi"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"

const ITEMS_PER_PAGE = 10

const TodoList = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [filter, setFilter] = useState("all")
  const [search, setSearch] = useState("")
  const [newTodoTitle, setNewTodoTitle] = useState("")
  const [newTodoDescription, setNewTodoDescription] = useState("")
  const [showAddForm, setShowAddForm] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [todoToDelete, setTodoToDelete] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [username, setName] = useState("")
  const [todos, setTodos] = useState([])
  const router = useRouter()

  useEffect(() => {
    const savedName = localStorage.getItem("username")
    if (savedName) setName(savedName)
  }, [])
  
  useEffect(() => {
  const checkAuth = async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) {
      router.push("/"); // redirect to home if not logged in
    }
  };
  checkAuth();
}, [router]);


  useEffect(() => {
    const loadInitialTodos = async () => {
      try {
        setLoading(true)
        setError(null)
        const apiTodos = await todoApi.getTodos()
        const localTodos = typeof window !== "undefined"
          ? JSON.parse(localStorage.getItem("todos") || "[]")
          : []
        const localIds = new Set(localTodos.map(todo => todo.id))
        const filteredApiTodos = apiTodos.filter(todo => !localIds.has(todo.id))
        const combinedTodos = [...localTodos, ...filteredApiTodos]
        setTodos(combinedTodos)
        if (typeof window !== "undefined") localStorage.setItem("todos", JSON.stringify(combinedTodos))
      } catch (err) {
        console.error("Failed to load todos from API:", err)
        setError("Failed to load todos from server")
        const localTodos = typeof window !== "undefined"
          ? JSON.parse(localStorage.getItem("todos") || "[]")
          : []
        setTodos(localTodos)
      } finally {
        setLoading(false)
      }
    }
    loadInitialTodos()
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined" && !loading) {
      localStorage.setItem("todos", JSON.stringify(todos))
    }
  }, [todos, loading])

  const handleAddTodo = async () => {
    if (!newTodoTitle.trim()) return
    const tempId = Date.now()
    const newTodo = {
      userId: 1,
      id: tempId,
      title: newTodoTitle,
      description: newTodoDescription,
      completed: false,
    }
    setTodos(prev => [newTodo, ...prev])
    setNewTodoTitle("")
    setNewTodoDescription("")
    setCurrentPage(1)
    setShowAddForm(false)
    try {
      const createdTodo = await todoApi.createTodo(newTodo)
      setTodos(prev =>
        prev.map(todo => todo.id === tempId ? { ...createdTodo, id: createdTodo.id || tempId } : todo)
      )
    } catch (error) {
      console.error("Failed to create todo on server:", error)
    }
  }


  const handleDeleteTodo = async (id) => {
    setTodos(prev => prev.filter(todo => todo.id !== id))
    setCurrentPage(1)
    setDeleteDialogOpen(false)
    setTodoToDelete(null)
    try { await todoApi.deleteTodo(id) } catch (error) { console.error(error) }
  }

  const toggleTodo = async (id) => {
    const todo = todos.find(t => t.id === id)
    if (!todo) return
    const updatedTodo = { ...todo, completed: !todo.completed }
    setTodos(prev => prev.map(t => t.id === id ? updatedTodo : t))
    try { await todoApi.updateTodo(id, updatedTodo) } catch (error) { console.error(error) }
  }

  const openDeleteDialog = (id) => { setTodoToDelete(id); setDeleteDialogOpen(true) }

  const filteredTodos = useMemo(() => {
    let filtered = [...todos]
    if (filter === "completed") filtered = filtered.filter(t => t.completed)
    else if (filter === "pending") filtered = filtered.filter(t => !t.completed)
    if (search.trim()) filtered = filtered.filter(t => t.title.toLowerCase().includes(search.toLowerCase()))
    return filtered
  }, [todos, filter, search])

  const stats = useMemo(() => ({
    total: todos.length,
    completed: todos.filter(t => t.completed).length,
    pending: todos.filter(t => !t.completed).length,
  }), [todos])

  const totalPages = Math.ceil(filteredTodos.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const currentTodos = filteredTodos.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  if (loading) return (
    <div className="bg-[#f5f5f7] flex items-center justify-center">
      <Card className="bg-white/80 backdrop-blur-sm border-0">
        <CardContent className="p-8 text-center">
          <div className="text-slate-400 mb-4"><Clock className="h-12 w-12 mx-auto animate-spin" /></div>
          <h3 className="text-lg font-medium text-bg-foreground mb-2">Loading your todos...</h3>
          <p className="text-slate-600">Please wait while we fetch your tasks</p>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Hello {username} 👋, you're here</h1>
          <p className="text-slate-600">
            Got something planned for today? It's time to Lockin...
            {error && <span className="block text-red-500 text-sm mt-2">⚠️ {error} - Working offline with local data</span>}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-white/80 border-0"><CardContent className="px-6 text-left"><div className="text-sm text-slate-600 pb-6">Total Tasks</div><div className="text-2xl font-bold text-slate-900">{stats.total}</div></CardContent></Card>
          <Card className="bg-white/80 backdrop-blur-sm border-0"><CardContent className="px-6 text-left"><div className="text-sm text-slate-600 text-left pb-6">Completed</div><div className="text-2xl font-bold text-green-600">{stats.completed}</div></CardContent></Card>
          <Card className="bg-white/80 backdrop-blur-sm border-0"><CardContent className="px-6 text-left"><div className="text-sm text-slate-600 pb-6">Pending</div><div className="text-2xl font-bold text-orange-600">{stats.pending}</div></CardContent></Card>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input aria-label="search" type="text" placeholder="Search todos..." value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1) }} className="bg-white/80 backdrop-blur-sm border-0 focus:ring-2 focus:ring-slate-500" />
          </div>
          <div className="flex gap-2">
            <Select value={filter} onValueChange={(value) => { setFilter(value); setCurrentPage(1) }}>
              <SelectTrigger className="w-[140px] bg-white/80 backdrop-blur-sm border-0"><SelectValue placeholder="All Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Button aria-label="add" onClick={() => setShowAddForm(!showAddForm)} className="bg-slate-900 hover:bg-slate-800"><Plus className="h-4 w-4" />Add Todo</Button>
          </div>
        </div>

        {/* Add Todo Form */}
        {showAddForm && (
          <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader><DialogTitle>Add New Todo</DialogTitle></DialogHeader>
              <div className="space-y-4 py-4">
                <Input aria-label="input" type="text" placeholder="What needs to be done?" value={newTodoTitle} onChange={(e) => setNewTodoTitle(e.target.value)} className="text-base sm:w-full" autoFocus onKeyPress={(e) => e.key === "Enter" && handleAddTodo()} />
                <Textarea aria-label="Description" placeholder="Optional description..." value={newTodoDescription} onChange={(e) => setNewTodoDescription(e.target.value)} className="text-base sm:w-full" />
              </div>
              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
                <Button onClick={handleAddTodo} className="bg-slate-900 hover:bg-slate-800">Add Todo</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {/* Todos List */}
        <div className="space-y-4">
          {currentTodos.length === 0 ? (
            <Card className="bg-white/80 backdrop-blur-sm border-0">
              <CardContent className="p-8 text-center">
                <div className="text-slate-400 mb-4"><Clock className="h-12 w-12 mx-auto" /></div>
                <h3 className="text-lg font-medium text-slate-900 mb-2">No todos found</h3>
                <p className="text-slate-600">{search || filter !== "all" ? "Try adjusting your search or filters" : "Create your first todo to get started"}</p>
              </CardContent>
            </Card>
          ) : currentTodos.map(todo => (
            <Card key={todo.id} className="bg-white/80 backdrop-blur-sm border-0 hover:shadow-md transition-all duration-200">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Button variant="ghost" size="sm" onClick={() => toggleTodo(todo.id)} className={`w-6 h-6 rounded-full border-2 p-0 mt-1 ${todo.completed ? "bg-green-500 border-green-500 hover:bg-green-600" : "border-slate-300 hover:border-green-400 hover:bg-transparent"}`}>
                    {todo.completed && <Check className="h-3 w-3 text-white" />}
                  </Button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <h3 className={`text-lg font-medium ${todo.completed ? "line-through text-slate-500" : "text-slate-900"}`}>{todo.title}</h3>
                      <Badge variant={todo.completed ? "default" : "secondary"} className={`hidden sm:inline-flex w-fit ${todo.completed ? "bg-green-100 text-green-800 hover:bg-green-100" : "bg-orange-100 text-orange-800 hover:bg-orange-100"}`}>{todo.completed ? "Completed" : "Pending"}</Badge>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <Badge variant={todo.completed ? "default" : "secondary"} className={`sm:hidden w-fit ${todo.completed ? "bg-green-100 text-green-800 hover:bg-green-100" : "bg-orange-100 text-orange-800 hover:bg-orange-100"}`}>{todo.completed ? "Completed" : "Pending"}</Badge>
                      <div className="flex gap-2 ml-auto">
                        <Button variant="ghost" size="sm">
                          <Link href={`/todos/${todo.id}`} className="flex items-center gap-1">
                            <Pencil className="h-4 w-4" /> Edit
                          </Link>
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => openDeleteDialog(todo.id)} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                          <Trash2 className="w-4 h-4 mr-1" /> Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            <Button variant="outline" onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} className="bg-white/80 backdrop-blur-sm border-0">
              <ArrowLeft className="w-4 h-4 mr-1" /> Prev
            </Button>
            {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => {
              const pageNum = i + 1
              return (
                <Button key={pageNum} variant={pageNum === currentPage ? "default" : "outline"} onClick={() => setCurrentPage(pageNum)} className={pageNum === currentPage ? "bg-slate-900 hover:bg-slate-800" : "bg-white/80 backdrop-blur-sm border-0"}>{pageNum}</Button>
              )
            })}
            <Button variant="outline" onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="bg-white/80 backdrop-blur-sm border-0">
              Next <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent className="bg-white/95 backdrop-blur-sm">
            <DialogHeader>
              <DialogTitle>Are you sure?</DialogTitle>
              <DialogDescription>This action cannot be undone. This will permanently delete the todo.</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
              <Button variant="destructive" onClick={() => handleDeleteTodo(todoToDelete)}>Confirm Delete</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export default TodoList
