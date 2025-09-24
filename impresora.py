#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script de prueba para impresora térmica JALPOS80U JALTECH
Prueba diferentes configuraciones de márgenes y ancho
"""

import sys
import os
import time
from datetime import datetime

class ThermalPrinterTest:
    def __init__(self, printer_name="POS-80C"):
        self.printer_name = printer_name
        self.ESC = b'\x1b'  # ESC character
        
    def send_to_printer_windows(self, data):
        """Enviar datos usando comando copy de Windows"""
        try:
            # Crear archivo temporal
            temp_file = f"temp_ticket_{int(time.time())}.prn"
            
            with open(temp_file, 'wb') as f:
                f.write(data)
            
            # Intentar múltiples métodos
            commands = [
                f'copy /B "{temp_file}" "\\\\.\\{self.printer_name}"',
                f'copy /B "{temp_file}" "LPT1:"',
                f'print /D:"\\\\.\\{self.printer_name}" "{temp_file}"'
            ]
            
            for cmd in commands:
                result = os.system(cmd)
                if result == 0:
                    print(f"✓ Enviado exitosamente con: {cmd}")
                    os.remove(temp_file)
                    return True
                    
            os.remove(temp_file)
            return False
            
        except Exception as e:
            print(f"Error enviando a impresora: {e}")
            return False
    
    def send_to_printer_powershell(self, data):
        """Enviar usando PowerShell"""
        try:
            temp_file = f"temp_ticket_{int(time.time())}.txt"
            
            with open(temp_file, 'wb') as f:
                f.write(data)
                
            ps_command = f'powershell -Command "Get-Content \\"{temp_file}\\" -Raw | Out-Printer -Name \\"{self.printer_name}\\""'
            
            result = os.system(ps_command)
            os.remove(temp_file)
            
            if result == 0:
                print("✓ Enviado exitosamente con PowerShell")
                return True
            return False
            
        except Exception as e:
            print(f"Error con PowerShell: {e}")
            return False
    
    def test_basic_configuration(self):
        """Prueba configuración básica"""
        print("\n=== PRUEBA 1: CONFIGURACIÓN BÁSICA ===")
        
        data = b''
        data += self.ESC + b'@'  # Initialize
        data += self.ESC + b'a\x01'  # Center
        data += b'PRUEBA BASICA JALPOS80U\n'
        data += b'========================\n'
        data += self.ESC + b'a\x00'  # Left align
        data += f'Fecha: {datetime.now().strftime("%d/%m/%Y %H:%M:%S")}\n'.encode('cp437', errors='ignore')
        data += b'40: ' + b'X' * 40 + b'\n'
        data += b'48: ' + b'X' * 48 + b'\n'
        data += b'56: ' + b'X' * 56 + b'\n'
        data += b'60: ' + b'X' * 60 + b'\n'
        data += b'\n\n\n'
        data += self.ESC + b'i'  # Cut
        
        return self.send_to_printer_powershell(data) or self.send_to_printer_windows(data)
    
    def test_margin_cancellation(self):
        """Prueba cancelación agresiva de márgenes"""
        print("\n=== PRUEBA 2: CANCELACIÓN DE MÁRGENES ===")
        
        data = b''
        # Inicialización
        data += self.ESC + b'@'  # Initialize printer
        
        # MÚLTIPLES COMANDOS PARA CANCELAR MÁRGENES
        data += self.ESC + b'l\x00'  # Cancel left margin método 1
        data += self.ESC + b'L'      # Cancel left margin método 2  
        data += self.ESC + b' \x00'  # Set horizontal tab
        data += self.ESC + b'Q\xff'  # Set right margin to maximum
        
        # Comandos adicionales específicos para impresoras POS
        data += self.ESC + b'W\x01\x00\x00\x50\x00'  # Set print area
        data += b'\x1c' + b'C\x00'   # Cancel print position
        data += b'\x1c' + b'L\x00\x00'  # Set left margin to 0
        
        # Fuente normal
        data += self.ESC + b'M\x00'  # Normal font
        data += self.ESC + b'!\x00'  # Reset font attributes
        
        # Contenido de prueba
        data += self.ESC + b'a\x01'  # Center
        data += self.ESC + b'!\x08'  # Bold
        data += b'PRUEBA DE MARGENES\n'
        data += self.ESC + b'!\x00'  # Normal
        data += b'JALPOS80U JALTECH\n'
        data += b'=' * 64 + b'\n'
        
        data += self.ESC + b'a\x00'  # Left align
        data += b'Configuracion aplicada:\n'
        data += b'- Cancel left margin (multiple)\n'  
        data += b'- Set right margin to max\n'
        data += b'- Print area configuration\n'
        data += b'- Reset position commands\n\n'
        
        # Pruebas de ancho
        data += b'Pruebas de ancho:\n'
        for width in [40, 48, 56, 60, 64, 72]:
            line = f'{width:2d}: '.encode() + b'X' * width + b'\n'
            data += line
            
        data += b'\nConteo de caracteres:\n'
        data += b'123456789012345678901234567890123456789012345678901234567890123456789012\n'
        data += b'         1         2         3         4         5         6         7\n\n'
        
        data += self.ESC + b'a\x01'  # Center
        data += b'La linea mas larga que se vea\n'
        data += b'completa es tu ancho maximo.\n\n'
        
        data += b'\n\n\n'
        data += self.ESC + b'i'  # Cut
        
        return self.send_to_printer_powershell(data) or self.send_to_printer_windows(data)
    
    def test_ticket_format(self):
        """Prueba formato de ticket como tu imagen"""
        print("\n=== PRUEBA 3: FORMATO DE TICKET ===")
        
        data = b''
        # Misma configuración agresiva
        data += self.ESC + b'@'  # Initialize
        data += self.ESC + b'l\x00'  # Cancel left margin
        data += self.ESC + b'L'      # Cancel left margin método 2
        data += self.ESC + b'Q\xff'  # Max right margin
        data += self.ESC + b'W\x01\x00\x00\x50\x00'  # Set print area
        data += self.ESC + b'M\x00'  # Normal font
        data += self.ESC + b'!\x00'  # Reset attributes
        
        # Espacios iniciales
        data += b'\n\n'
        
        # Encabezado centrado
        data += self.ESC + b'a\x01'  # Center
        data += self.ESC + b'!\x08'  # Bold
        data += b'EL REY DE LOS BUNUELOS\n'
        data += self.ESC + b'!\x00'  # Normal
        data += b'TICKET DE PEDIDO\n'
        
        # Línea punteada (probar diferentes longitudes)
        for length in [48, 56, 60]:
            data += ('.' * length + f' ({length})\n').encode()
            
        data += b'\n'
        
        # Información del pedido
        data += self.ESC + b'a\x00'  # Left align
        data += b'Cliente: Faber\n'
        data += b'Turno: #06\n'  
        data += b'Codigo: REY30947006\n'
        data += f'Fecha: {datetime.now().strftime("%d/%m/%Y, %H:%M:%S")} a. m.\n'.encode()
        
        data += b'.' * 56 + b'\n\n'
        
        # Productos
        data += b'PRODUCTOS PEDIDOS:\n\n'
        data += b'1x Bunuelo de Arequipe' + b' ' * 20 + b'2000\n'
        
        data += b'\n'
        data += b'_' * 56 + b'\n\n'
        
        # Total centrado
        data += self.ESC + b'a\x01'  # Center
        data += self.ESC + b'!\x18'  # Double size
        data += b'TOTAL: 2000\n'
        data += self.ESC + b'!\x00'  # Normal
        data += b'\n'
        
        # Mensaje final
        data += b'Gracias por elegir El Rey de los Bunuelos!\n'
        data += b'Espera tu turno para recoger tu pedido\n'
        data += b'Conserva este ticket como comprobante\n'
        
        data += b'\n\n\n\n\n\n'
        data += self.ESC + b'i'  # Cut
        
        return self.send_to_printer_powershell(data) or self.send_to_printer_windows(data)
    
    def test_raw_commands(self):
        """Prueba comandos específicos JALTECH"""
        print("\n=== PRUEBA 4: COMANDOS ESPECÍFICOS JALTECH ===")
        
        data = b''
        # Reset completo
        data += self.ESC + b'@'  # Initialize
        
        # Comandos específicos que podrían funcionar con JALTECH
        data += b'\x1d' + b'W\x80\x02'  # Set print area width (específico)
        data += self.ESC + b'$\x00\x00'  # Set absolute horizontal print position
        data += b'\x1c' + b'.\x00'   # Cancel user-defined character set
        
        # Forzar configuración de página
        data += self.ESC + b'l\x00'  # Left margin = 0
        data += self.ESC + b'Q\x50'  # Right margin = 80
        
        data += self.ESC + b'a\x01'  # Center
        data += b'COMANDOS ESPECIFICOS JALTECH\n'
        data += b'============================\n'
        
        data += self.ESC + b'a\x00'  # Left
        data += b'Comandos aplicados:\n'
        data += b'- GS W (print area width)\n'
        data += b'- ESC $ (absolute position)\n'  
        data += b'- FS . (cancel user chars)\n'
        data += b'- Left margin = 0\n'
        data += b'- Right margin = 80\n\n'
        
        # Test visual
        data += b'TEST VISUAL:\n'
        data += b'|' + b'-' * 78 + b'|\n'
        data += b'|' + b' ' * 78 + b'|\n'
        data += b'|' + 'ANCHO MAXIMO DISPONIBLE'.center(78).encode() + b'|\n'
        data += b'|' + b' ' * 78 + b'|\n'
        data += b'|' + b'-' * 78 + b'|\n\n'
        
        data += b'\n\n\n'
        data += self.ESC + b'i'  # Cut
        
        return self.send_to_printer_powershell(data) or self.send_to_printer_windows(data)

def main():
    print("SCRIPT DE PRUEBA PARA IMPRESORA JALPOS80U")
    print("=========================================")
    
    # Permitir especificar nombre de impresora
    printer_name = input(f"Nombre de la impresora (Enter para 'POS-80C'): ").strip()
    if not printer_name:
        printer_name = "POS-80C"
    
    tester = ThermalPrinterTest(printer_name)
    
    print(f"Usando impresora: {printer_name}")
    print("\nEjecutando pruebas...")
    
    # Ejecutar todas las pruebas
    tests = [
        ("Configuración básica", tester.test_basic_configuration),
        ("Cancelación de márgenes", tester.test_margin_cancellation), 
        ("Formato de ticket", tester.test_ticket_format),
        ("Comandos específicos JALTECH", tester.test_raw_commands)
    ]
    
    for test_name, test_func in tests:
        print(f"\n--- {test_name} ---")
        try:
            success = test_func()
            if success:
                print(f"✓ {test_name}: Enviado correctamente")
                input("Presiona Enter para continuar con la siguiente prueba...")
            else:
                print(f"✗ {test_name}: Error al enviar")
                if input("¿Continuar con la siguiente prueba? (s/n): ").lower() != 's':
                    break
        except Exception as e:
            print(f"✗ Error en {test_name}: {e}")
            if input("¿Continuar? (s/n): ").lower() != 's':
                break
    
    print("\n=== PRUEBAS COMPLETADAS ===")
    print("Revisa los tickets impresos para determinar:")
    print("1. ¿Cuál es el ancho máximo que se imprime completo?")
    print("2. ¿Qué configuración dio mejor resultado?")
    print("3. ¿Las líneas se ven centradas correctamente?")

if __name__ == "__main__":
    main()