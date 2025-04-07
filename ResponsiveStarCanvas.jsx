//Canvas animation in React

import { useEffect, useRef } from 'react'

export const Canvas = () => {
  const canvasRef = useRef(null)
  const animationRef = useRef(null)
  const starsRef = useRef([])
  const mousePosRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    const initCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight

      starsRef.current = Array.from({ length: 200 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2,
        alpha: Math.random(),
        delta: Math.random() * 0.02,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        layer: Math.random() * 3 + 1
      }))
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      starsRef.current.forEach(star => {
        star.alpha += star.delta
        if (star.alpha > 1 || star.alpha < 0) star.delta *= -1
        
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`
        ctx.fill()
      })
    }

    const update = () => {
      const { x: mouseX, y: mouseY } = mousePosRef.current
      
      starsRef.current.forEach(star => {
        const dx = (mouseX - canvas.width / 2) * 0.001 * star.layer
        const dy = (mouseY - canvas.height / 2) * 0.001 * star.layer
        
        star.x = (star.x + star.speedX + dx + canvas.width) % canvas.width
        star.y = (star.y + star.speedY + dy + canvas.height) % canvas.height
      })
    }

    const animate = () => {
      update()
      draw()
      animationRef.current = requestAnimationFrame(animate)
    }

    const handleMouseMove = (e) => {
      mousePosRef.current = { x: e.clientX, y: e.clientY }
    }

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    initCanvas()
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('resize', handleResize)
    animate()

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationRef.current)
    }
  }, [])

  return <canvas ref={canvasRef} className="star-canvas" aria-hidden="true" />
}
