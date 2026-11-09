package com.webii.util;

public final class CpfUtil {
    private CpfUtil() {}

    public static boolean valido(String cpf) {
        if (cpf == null) return false;
        String digitos = cpf.replaceAll("\\D","");
        if (digitos.length() != 11 || digitos.chars().distinct().count() == 1) return false;
        for (int posicao = 9; posicao <= 10; posicao++) {
            int soma = 0;
            for (int i = 0; i < posicao; i++) {
                soma += (digitos.charAt(i) - '0') * (posicao + 1 - i);
            }
            int verificador = (soma * 10) % 11;
            if (verificador == 10) verificador = 0;
            if (verificador != digitos.charAt(posicao) - '0') return false;
        }
        return true;
    }
}