$base = "$env:USERPROFILE\Desktop\n8n"
$out  = "$base\resultados_cypress.csv"
"execucao;modelo;base;it;estado" | Set-Content -Encoding UTF8 $out

Get-ChildItem "$base\execucoes" -Directory |
  Sort-Object { [int]($_.Name -replace '^execucao_(\d+)_.*', '$1') } |
  ForEach-Object {
    $pasta = $_.FullName
    $null = $_.Name -match '^execucao_(\d+)_(.+)_(Fragil|Forte)$'
    $n = $Matches[1]; $modelo = $Matches[2]; $cond = $Matches[3]

    # limpa o projeto e copia os arquivos desta execução
    Remove-Item "$base\cypress\e2e\*", "$base\cypress\support\*", "$base\cypress\fixtures\*" -Force -ErrorAction SilentlyContinue
    Copy-Item "$pasta\e2e\*"      "$base\cypress\e2e\"      -Force
    Copy-Item "$pasta\support\*"  "$base\cypress\support\"  -Force
    Copy-Item "$pasta\fixtures\*" "$base\cypress\fixtures\" -Force
    Copy-Item "$pasta\cypress.config.js" "$base\cypress.config.js" -Force

    # roda e grava o relatório (JUnit) e o log dentro da própria pasta da execução
    Push-Location $base
    npx cypress run --reporter junit --reporter-options "mochaFile=$pasta\resultado.xml,toConsole=false" *> "$pasta\cypress_log.txt"
    Pop-Location

    if (Test-Path "$pasta\resultado.xml") {
      [xml]$x = Get-Content "$pasta\resultado.xml" -Raw
      $passou = 0; $total = 0
      foreach ($ts in $x.testsuites.testsuite) {
        foreach ($tc in $ts.testcase) {
          $total++
          $estado = if ($tc.failure -or $tc.error) { 'falhou' } elseif ($tc.skipped) { 'pendente' } else { 'passou' }
          if ($estado -eq 'passou') { $passou++ }
          "$n;$modelo;$cond;$($tc.name);$estado" | Add-Content -Encoding UTF8 $out
        }
      }
      Write-Host "execucao $n ($modelo/$cond): $passou/$total aprovados"
    } else {
      "$n;$modelo;$cond;(spec nao executou);erro" | Add-Content -Encoding UTF8 $out
      Write-Host "execucao $n ($modelo/$cond): spec nao executou - veja $pasta\cypress_log.txt" -ForegroundColor Red
    }
  }